Meteor.methods({
  // testMethod: function () {
  //   // plan
  //   // meteor defer damit es später passiert
  //   // callback oder try/catch um fehler zu fangen
  //   console.log('testMethod called');
  //   Meteor.defer( function() {
  //     try {
  //       Meteor.call('sendTestMail', false, 5000 );
  //     // Meteor.call('sendTestMail', false, 5000, function (error, result) {
  //     //   if (error)
  //     //     console.log(error);
  //     // });
  //     }
  //     catch(error) {
  //       console.log(error);
  //     }

  //   });
  //   // console.log('going to sleep');
  //   // Meteor._sleepForMs( 2000 );
  //   // console.log('sleep over');
  //   console.log('method end');
  // },
  createEvent: function (options) {
    check(options, {
      courseId: NonEmptyString,
      courseDate: [ Date ]
    });

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    
    var fields = { owner: 1, title: 1 };
    var course = Courses.findOne({_id: options.courseId}, {fields: fields });
    checkExistance( course, "Kurs", fields );

    if ( this.userId !== course.owner )
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    var user = Meteor.users.findOne( this.userId );
    var username = displayName( user );

    Current.insert({
      course: options.courseId,
      courseTitle: course.title,
      owner: course.owner,
      ownerName: username,
      courseDate: options.courseDate
    });

    Courses.update({_id: options.courseId}, { $push: {dates: options.courseDate }, $set: { hasDate: true } }, {validate: false});
  },
  deleteEvent: function (options) {
    check(options, {
      courseId: NonEmptyString,
      currentId: NonEmptyString,
      courseDate: [ Date ]
    });

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var fields = { owner: 1, dates: 1 };
    var course = Courses.findOne( { _id: options.courseId }, { fields: fields } );
    checkExistance( course, "Kurs", fields );

    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    fields = { owner: 1 };
    var current = Current.findOne( { _id: options.currentId }, { fields: fields } );
    checkExistance( current, "Event", fields );

    if (this.userId !== current.owner)
      throw new Meteor.Error(422, "Sie können nur Ihre eigenen Events löschen");

    if (course.dates.length === 1) 
      Courses.update( {_id: options.courseId }, { $pull: { dates: options.courseDate }, $set: { hasDate: false } }, {validate: false} );
    else
      Courses.update( {_id: options.courseId }, { $pull: { dates: options.courseDate } }, {validate: false} );

    Current.remove({_id: options.currentId});
  },
  declineEvent: function ( token ) {
    check( token, NonEmptyString );

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");

    var fields = { owner: 1, course: 1, participants: 1, courseDate: 1 };
    var current = Current.findOne( { token: token }, { fields: fields } );
    checkExistance( current, "Event", fields );

    if ( !current.participants.length )
      throw new Meteor.Error(403, "Keine Teilnehmer gefunden");

    if (this.userId !== current.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    fields = { owner: 1, dates: 1 };
    var course = Courses.findOne( { _id: current.course }, { fields: fields } );
    checkExistance( course, "Kurs", fields );

    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    if ( course.dates.length === 1 ) 
      Courses.update( { _id: current.course }, { $pull: { dates: current.courseDate }, $set: { hasDate: false } } );
    else
      Courses.update( { _id: current.course }, { $pull: { dates: current.courseDate } } );

    Current.remove( { token: token } );

    Meteor.call( 'sendEventDeclinedParticipantsEmail', { course: current.course, participants: current.participants }, function ( error, result ) {
      if ( error ) {
        console.log( error );
      }
    });
  }, 
  confirmEvent: function ( token, options ) {
    check(token, NonEmptyString);

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");

    var fields = { owner: 1 };
    var current = Current.findOne( { token: token }, { fields: fields } );
    checkExistance( current, "Event", fields );

    if (this.userId !== current.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    Current.update( { token: token }, { $set: { confirmed: true, token: "" } } );

    Meteor.call( 'sendCourseFullParticipantsEmail', options, function ( error, result ) {
      if ( error ) {
        console.log( error );
      }
    });
  },
  updateRoles: function () {
    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");
    Roles.setUserRoles(this.userId, 'trainer');
  },
  deleteMyAccount: function () {
    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");

    if ( Roles.userIsInRole( this.userId, 'trainer' ) ) {
      // check if there are open bookings in his current events
      if (Current.findOne( { owner: this.userId, 'participants.0': {$exists: true} }, { fields: { _id: 1 } } ) ) {
        throw new Meteor.Error(421, "Sie haben offene Buchungen in einem Ihrer Kurse. Bitte kontaktieren Sie uns und wir finden gemeinsam eine Lösung.");
      }
      // remove all of his offered courses
      Courses.remove({ owner: this.userId });
      // and remove all of the current events of the courses
      Current.remove({ owner: this.userId });
    }
    else {
      // check if user has open bookings:
      if (Current.findOne( { participants: this.userId }, { fields: { _id: 1 } } ) ) {
        throw new Meteor.Error(422, "Sie haben offene Buchungen. Bitte kontaktieren Sie uns und wir finden gemeinsam eine Lösung.");
      }
    }

    var thisUserId = this.userId;
    Meteor.users.update(this.userId, { $set: { "services.resume.loginTokens": [] } }); // logout the user
    Meteor.users.remove({_id: thisUserId});
  }
});

//// custom admin methods

Houston.add_collection(Meteor.users);
Houston.add_collection(Houston._admins);
Houston.add_collection(Courses);
Houston.add_collection(Current);
Houston.add_collection(Elapsed);
Houston.add_collection(Categories);

Houston.methods( Courses, {
  Publish: function ( course ) {
    Courses.update(course._id, { $set: { isPublic: true, hasPublishRequest: false } }, { validate: false } );
    return "Der Kurs: '"+ course.title + "' ist jetzt online!";
  },
  Unpublish: function ( course ) {
  	Courses.update(course._id, { $set: { isPublic: false } }, { validate: false } );
    return "Ok, der Kurs: '"+ course.title + "' ist offline.";
  }
});

Houston.methods( Meteor.users, {
  Publish: function ( user ) {
    Meteor.users.update(user._id, { $set: { isPublic: true, hasPublishRequest: false } }, { validate: false } );
    return "Das Profil von: '"+ user.profile.name + "' ist jetzt online!";
  },
  Unpublish: function ( user ) {
    Meteor.users.update(user._id, { $set: { isPublic: false } }, { validate: false } );
    return "Ok, das Profil von: '"+ user.profile.name + "' ist offline.";
  }
});

Houston.methods( Current, {
  Confirm: function ( current ) {
    Current.update( current._id, { $set: { confirmed: true } }, { validate: false } );
    return "Das Event am " + current.courseDate + " zum Kurs: '"+ current.title + "' findet statt!";
  },
  Unconfirm: function ( current ) {
    Current.update( current._id, { $set: { confirmed: false } }, { validate: false } );
    return "Ok, das Event am " + current.courseDate + " zum Kurs: '"+ current.title + "' findet nicht statt.";
  }
});