Meteor.methods({
	// createInquired: function (options) {
 //    if (! this.userId)
 //      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");
 //    var id = Inquired.insert({
 //      owner: options.owner,
 //      course: options.course,
 //      inquirer: this.userId,
 //      inquiredDates: options.dates,
 //      createdAt: new Date()
 //    });
 //    return id;
 //    // TODO: send email to owner
 //  },
 //  confirmInquired: function (options) {
 //    // TODO: check that user._id = course.owner
 //    // date confirmed so insert into current
 //    Current.insert({
 //      _id: options.id,
 //      course: options.course,
 //    	owner: options.owner,
 //      participants: [options.inquirer],
 //      courseDate: options.confirmedDate
 //    });
    
 //    //remove from Inquired:
 //    Inquired.remove({_id: options.id});
 //  },
  createEvent: function (options) {
    check(options, {
      courseId: NonEmptyString,
      courseDate: [ Date ]
    });

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    
    var course = Courses.findOne({_id: options.courseId}, {fields: { owner:1, title:1 } });

    if (! course)
      throw new Meteor.Error(403, "Kurs nicht gefunden");

    if (! course.owner)
      throw new Meteor.Error(403, "Kurs-Besitzer nicht gefunden");

    if (! course.title)
      throw new Meteor.Error(403, "Kurstitel nicht gefunden");

    if (this.userId !== course.owner)
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

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var course = Courses.findOne({_id: options.courseId}, {fields: {owner:1, dates:1 }});

    if (! course) 
      throw new Meteor.Error(423, "Kurs nicht gefunden.");

    if (! course.owner) 
      throw new Meteor.Error(423, "Kurs hat keinen Besitzer.");

    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    if (! course.dates) 
      throw new Meteor.Error(423, "Kursdatum für Event nicht gefunden.");

    var current = Current.findOne({_id: options.currentId}, {fields: {owner:1}});

    if (! current) 
      throw new Meteor.Error(423, "Event nicht gefunden.");

    if (! current.owner) 
      throw new Meteor.Error(423, "Event hat keinen Besitzer.");

    if (this.userId !== current.owner)
      throw new Meteor.Error(422, "Sie können nur Ihre eigenen Events löschen");

    if (course.dates.length === 1) 
      Courses.update( {_id: options.courseId }, { $pull: { dates: options.courseDate }, $set: { hasDate: false } }, {validate: false} );
    else
      Courses.update( {_id: options.courseId }, { $pull: { dates: options.courseDate } }, {validate: false} );

    Current.remove({_id: options.currentId});
  },
  declineEvent: function (token) {
    check(token, NonEmptyString);

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");

    var current = Current.findOne( { token: token }, { fields: { owner: 1, course: 1, participants: 1, courseDate:1 } } );

    if (!current || !current.owner) 
      throw new Meteor.Error(407, "Event oder Trainer nicht gefunden.");

    if (this.userId !== current.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    if (!current.course)
      throw new Meteor.Error(403, "Kurs-Id nicht gefunden");

    if (!current.courseDate)
      throw new Meteor.Error(403, "Event Termin nicht gefunden");

    if (!current.participants || !current.participants.length)
      throw new Meteor.Error(403, "Keine Teilnehmer gefunden");

    var course = Courses.findOne({_id: current.course}, {fields: {owner:1, dates:1 }});

    if (! course) 
      throw new Meteor.Error(423, "Kurs nicht gefunden.");

    if (! course.owner) 
      throw new Meteor.Error(423, "Kurs hat keinen Besitzer.");

    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    if (! course.dates) 
      throw new Meteor.Error(423, "Kursdatum für Event nicht gefunden.");

    Meteor.call('sendEventDeclinedParticipantsEmail', {course: current.course, participants: current.participants} );

    if (course.dates.length === 1) 
      Courses.update( {_id: current.course }, { $pull: { dates: current.courseDate }, $set: { hasDate: false } } );
    else
      Courses.update( {_id: current.course }, { $pull: { dates: current.courseDate } } );

    Current.remove( { token: token } );
  }, 
  confirmEvent: function (token) {
    check(token, NonEmptyString);

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");

    var current = Current.findOne({token: token}, {fields: {owner:1}});

    if (!current || !current.owner) 
      throw new Meteor.Error(407, "Event oder Trainer nicht gefunden.");

    if (this.userId !== current.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    Current.update( { token: token }, { $set: {confirmed: true, token: ""} } );
  },
  updateRoles: function () {
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");
    Roles.setUserRoles(this.userId, 'trainer');
  },
  deleteMyAccount: function () {
    if (! this.userId)
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
Houston.add_collection(Inquired);
Houston.add_collection(Current);
Houston.add_collection(Elapsed);
Houston.add_collection(Categories);

Houston.methods(Courses, {
  Publish: function (course) {
    Courses.update(course._id, {$set: {public: true, publishRequest: false}}, {validate: false});
    return "Der Kurs: '"+ course.title + "' ist jetzt online!";
  },
  Unpublish: function (course) {
  	Courses.update(course._id, {$set: {public: false}}, {validate: false});
    return "Ok, der Kurs: '"+ course.title + "' ist offline.";
  }
});

Houston.methods(Meteor.users, {
  Publish: function (user) {
    Meteor.users.update(user._id, {$set: {public: true, publishRequest: false}}, {validate: false});
    return "Das Profil von: '"+ user.profile.name + "' ist jetzt online!";
  },
  Unpublish: function (user) {
    Meteor.users.update(user._id, {$set: {public: false}}, {validate: false});
    return "Ok, das Profil von: '"+ user.profile.name + "' ist offline.";
  }
});