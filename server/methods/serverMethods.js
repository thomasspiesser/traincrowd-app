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
  redeemCoupon: function ( options ) {
    check(options, {
      bookingId: NonEmptyString,
      code: NonEmptyString
    });

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var fields = { customer: 1, bookingStatus: 1, eventId: 1 };
    var booking = Bookings.findOne( { _id: options.bookingId }, { fields: fields } );
    checkExistance( booking, "Buchung", fields );

    if ( booking.bookingStatus !== 'inProgress' ) 
      throw new Meteor.Error(403, "Buchung ist bereits abgeschlossen");

    if ( booking.customer !== this.userId )
      throw new Meteor.Error(403, "Diese Buchung gehört zu einem anderen Kunden. Bitte starten Sie den Buchungsprozess von vorne.");

    var current = Current.findOne( { _id: booking.eventId }, { fields: { coupons: 1 } } );
    if ( ! current.coupons )
      throw new Meteor.Error(403, "Das ist kein gültiger Gutschein- oder Aktionscode für diese Veranstaltung");

    // find coupon that matches the code
    var coupon = _.find( current.coupons, function( coupon ) { return coupon.code === options.code; } );

    if ( ! coupon )
      throw new Meteor.Error(403, "Das ist kein gültiger Gutschein- oder Aktionscode");

    if ( ! coupon.isValid )
      throw new Meteor.Error(403, "Gutschein- oder Aktionscode ist nicht mehr gültig");

    if ( coupon.expires < new Date() )
      throw new Meteor.Error(403, "Gutschein- oder Aktionscode ist abgelaufen");
    
    var modifier = {
      'coupon.code': coupon.code,
      'coupon.amount': coupon.amount,
    };

    Bookings.update( { _id: options.bookingId }, { $set: modifier } );
    return coupon.amount;
  },
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

    var username = Meteor.users.findOne( this.userId ).getName();

    Current.insert({
      course: options.courseId,
      courseTitle: course.title,
      owner: course.owner,
      ownerName: username,
      courseDate: options.courseDate
    });

    Courses.update( { _id: options.courseId }, { $push: { dates: options.courseDate }, $set: { hasDate: true } } );
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

    if ( course.dates.length === 1 ) 
      Courses.update( {_id: options.courseId }, { $pull: { dates: options.courseDate }, $set: { hasDate: false } } );
    else {
      // this workaround to pull just one not all elements breaks atomicity
      Courses.update( { _id: options.courseId, dates: options.courseDate }, { $unset: { "dates.$": options.courseDate } } );
      Courses.update( { _id: options.courseId }, { $pull: { dates: null } } );
      // Courses.update( { _id: options.courseId }, { $pull: { dates: options.courseDate } } );
    }

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
    else {
      // this workaround to pull just one not all elements breaks atomicity
      Courses.update( { _id: current.course, dates: current.courseDate }, { $unset: { "dates.$": current.courseDate } } );
      Courses.update( { _id: current.course }, { $pull: { dates: null } } );
      // Courses.update( { _id: current.course }, { $pull: { dates: current.courseDate } } );
    }

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
  },
  rateCourse: function ( options ) {
    check( options, {
      elapsedId: NonEmptyString,
      values: [ Number ],
      comment: Match.Optional(String),
      recommendation: Match.Optional(String),
      token: Match.Optional(String),
    });

    if ( ! this.userId && ! options.token )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");

    var userId;
    if ( this.userId ) 
      userId = this.userId;
    else {
      var user = Meteor.users.findOne( { rateTokens: options.token }, { fields: { _id: 1 } } );
      if ( ! user )
        throw new Meteor.Error(403, "User nicht gefunden!");
      userId = user._id;
    }

    var fields = { course: 1, participants: 1, ratings: 1, owner: 1 };
    var elapsed = Elapsed.findOne( { _id: options.elapsedId }, { fields: fields } );
    checkExistance( elapsed, "Elapsed Event", fields );

    if (! _.contains( elapsed.participants, userId ))
      throw new Meteor.Error(403, "Sie können nur Kurse bewerten, die Sie besucht haben.");

    var existingRating = _.find( elapsed.ratings, function(item) { return item.participant === userId; } );
    if ( existingRating ) {
      existingRating.values = options.values;
      existingRating.comment = options.comment;
      existingRating.recommendation = options.recommendation;
      Elapsed.update( options.elapsedId, { $set: { ratings: elapsed.ratings } } );
    }
    else {
      Elapsed.update( options.elapsedId, { $push: { 
        ratings: { 
          participant: userId, 
          values: options.values,
          comment: options.comment,
          recommendation: options.recommendation,
        } 
      } } );
    }

    Meteor.defer(function(){
      try {
        _updateCourseRating( elapsed.course );
        _updateTrainerRating( elapsed.owner );
        Meteor._sleepForMs(1000); // wait to make sure there is no UI glitch when token is removed
        Meteor.users.update( { _id: userId }, { $pull: { rateTokens: options.token } } );
      }
      catch(e) {
        console.log(e);
      }
    });
  },
});

var _updateCourseRating = function( course ) {
  // console.log('course rating');
  // get all elapsed for given course
  var elapsed = Elapsed.find( { course: course }, { fields: { ratings: 1 } } ).fetch();
  // console.log(elapsed);
  var ratingElapsedArrays = _.map(elapsed, function(object) {return _.pluck(object.ratings, 'values'); } ); 
  // [ [ [ 3, 1, 3, 2, 5 ] ], [ [ 2, 4.5, 3, 3, 3 ], [ 5, 1.5, 2, 3, 1 ] ] ] non-flat
  // console.log(ratingElapsedArrays);
  var ratingArrays = _.flatten(ratingElapsedArrays, true); // shallow flatten = true: means one level deep
  // [ [ 3, 1, 3, 2, 5 ], [ 2, 4.5, 3, 3, 3 ], [ 5, 1.5, 2, 3, 1 ] ] flatter
  // now sort element-wise
  // console.log(ratingArrays);
  var ratingScores = _.zip.apply(_,ratingArrays);
  // [ [ 3, 2, 5 ],  [ 1, 4.5, 1.5 ],  [ 3, 3, 2 ],  [ 2, 3, 3 ],  [ 5, 3, 1 ] ]
  // console.log(ratingScores);
  var ratingCount = ratingScores[0].length;
  // console.log(ratingCount);
  var ratingSums = _.map(ratingScores, function (array) {return _.reduce( _.compact(array), function(a, b){ return a + b; }, 0); } );
  // [10, 7, 8, 8, 9]
  // console.log(ratingSums);
  var avgsRatings = _.map(ratingSums, function(num){ return num / ratingCount; });
  // console.log(avgsRatings);
  // [3.33, 2.33, 2.66, 2.66, 3]
  var ratingSum = _.reduce(avgsRatings, function(a, b){ return a + b; }, 0);
  // console.log(ratingSum);
  var avgRating = ratingSum / avgsRatings.length;
  // console.log(avgRating);
  Courses.update( course, { $set: { rating: avgRating, ratingDetail: avgsRatings } } );
};

var _updateTrainerRating = function( owner ) {
  // console.log('trainer rating');
  // get all courses for given owner = trainer
  // console.log(owner);
  var courses = Courses.find( { owner: owner }, { fields: { rating: 1 } } ).fetch();
  // console.log(courses);
  var ratings = _.pluck( courses, 'rating' ); // zB. [undefined, 2.75, undefined, undefined]
  // console.log(ratings);
  ratings = _.compact( ratings ); // remove falsy values
  // console.log(ratings);
  var ratingSum = _.reduce( ratings, function(a, b) { return a + b; }, 0 );
  // console.log(ratingSum);
  var ratingCount = ratings.length;
  // console.log(ratingCount);
  var avgRating = ratingSum / ratingCount;
  // console.log(avgRating);
  Meteor.users.update( { _id: owner }, { $set: { 'profile.rating': avgRating } } );
};
