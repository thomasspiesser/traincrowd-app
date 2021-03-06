Meteor.methods({
  sendRequestPublicationEmail: function (options) {
    // check done in method setCoursePublishRequest
    var subject = "Anfrage zur Freischaltung von " + options.what + ": " + options.itemName;
    var html = Spacebars.toHTML(options, Assets.getText('requestPublicationEmail.html'));
    options = { 
      to: 'info@traincrowd.de', 
      // to: 'thomas@traincrowd.de', 
      subject: subject, 
      html: html 
    };
    
    _deferSendEmail( options );
  },
  sendAskIfEventExpiredTrainerEmail: function (options) {
    check(options, {
      currentId: NonEmptyString,
      course: NonEmptyString,
      token: NonEmptyString
    });

    var fields = { title: 1, owner: 1, slug: 1, fee: 1, maxParticipants: 1 };
    var course = Courses.findOne( { _id: options.course }, { fields: fields } ); 
    var pass = checkExistanceSilent( course, "course", options.course, fields );

    if ( ! pass )
      return;
    
    var user = Meteor.users.findOne( course.owner );
    if (! user) {
      console.log( "Can't find user with id: " + course.owner );
      return;
    }
    var email = user.getEmail();
    var name = user.getName();

    fields = { courseDate: 1, participants: 1 };
    var current = Current.findOne( { _id: options.currentId }, { fields: fields } );
    pass = checkExistanceSilent( current, "event", options.currentId, fields );

    if ( ! pass )
      return;

    if ( ! current.participants.length ) {
      console.log( "Event: " + options.currentId + " doesn't have participants." );
      return;
    }

    var urlYES = Meteor.absoluteUrl( 'course/' + course.slug + '/confirm-event/' + options.token );
    var urlNO = Meteor.absoluteUrl( 'course/' + course.slug + '/decline-event/' + options.token );

    var feeReducedTotal = ( course.fee / course.maxParticipants * current.participants.length ).toFixed(0);
    var commision = calcCommision( feeReducedTotal );
    var dataContext = {
      name: name,
      course: course,
      courseDate: moment( current.courseDate[0] ).utcOffset(120).format("DD.MM.YYYY"),
      participantsLength: current.participants.length,
      feeReducedTotal: feeReducedTotal,
      commision: commision,
      urlYES: urlYES,
      urlNO: urlNO
    };

    var subject = "Ihr Kurs: '" + course.title + "'" + " ist leider nicht voll geworden.";
    var html = Spacebars.toHTML(dataContext, Assets.getText('askIfEventExpiredTrainerEmail.html'));
    options = { 
      to: email, 
      subject: subject, 
      html: html 
    };
    
    _deferSendEmail( options );
  },
  sendInformEventExpiredTrainerEmail: function (options) {
    check(options, {
      currentId: String,
      course: String
    });

    var fields = { title: 1, owner: 1 };
    var course = Courses.findOne( { _id: options.course }, { fields: fields } ); 
    var pass = checkExistanceSilent( course, "course", options.course, fields );

    if ( ! pass )
      return;
    
    var user = Meteor.users.findOne( course.owner );
    if (! user) {
      console.log( "Can't find user with id: " + course.owner );
      return;
    }
    var email = user.getEmail();
    var name = user.getName();

    fields = { courseDate: 1 };
    var current = Current.findOne( { _id: options.currentId }, { fields: fields } );
    pass = checkExistanceSilent( current, "event", options.currentId, fields );

    if ( ! pass )
      return;

    var dataContext = {
      name: name,
      course: course,
      courseDate: moment( current.courseDate[0] ).utcOffset(120).format("DD.MM.YYYY")
    };

    var subject = "Ihr Kurs: '" + course.title + "'" + " ist leider nicht voll geworden.";
    var html = Spacebars.toHTML(dataContext, Assets.getText('informEventExpiredTrainerEmail.html'));
    options = { 
      to: email, 
      subject: subject, 
      html: html 
    };
    
    _deferSendEmail( options );
  },
  sendEventDeclinedParticipantsEmail: function (options) {
    check(options, {
      course: String,
      participants: [ String ]
    });

    var fields = { title: 1, slug: 1 };
    var course = Courses.findOne( { _id: options.course }, { fields: fields } ); 
    var pass = checkExistanceSilent( course, "course", options.course, fields );

    if ( ! pass )
      return;

    var url = Meteor.absoluteUrl('course/' + course.slug);
    _.each(options.participants, function( participant ) {
      var user = Meteor.users.findOne( participant );
      if (! user) {
        console.log( "Can't find user with id: " + participant );
        return;
      }
      var email = user.getEmail();
      var name = user.getName();

      var dataContext = {
        name: name,
        course: course,
        url: url
      };
      var subject = "Der Kurs: '" + course.title + "'" + " findet leider nicht statt.";
      var html = Spacebars.toHTML(dataContext, Assets.getText('eventDeclinedParticipantEmail.html'));

      var options = { 
        to: email, 
        subject: subject, 
        html: html 
      };
      
      _deferSendEmail( options );
    });
  },
  sendRateCourseEmail: function ( options ) {
    check( options, {
      elapsedId: NonEmptyString
    });

    fields = { courseTitle: 1, participants: 1 };
    var elapsed = Elapsed.findOne( { _id: options.elapsedId }, { fields: fields } );
    pass = checkExistanceSilent( elapsed, "event", options.elapsedId, fields );

    if ( ! pass )
      return;

    var url = Meteor.absoluteUrl('event/' + options.elapsedId + '/rate-event/');
    _.each( elapsed.participants, function( participant ) {
      var user = Meteor.users.findOne( participant );
      if (! user) {
        console.log( "Can't find user with id: " + participant );
        return;
      }
      // save a token
      var token = Random.hexString(64);
      Meteor.users.update( { _id: participant }, { 
        $push: { rateTokens: token }
      });
      var email = user.getEmail();
      var name = user.getName();

      var dataContext = {
        name: name,
        title: elapsed.courseTitle,
        url: url + token
      };
      var subject = "Bewerten Sie den Kurs: '" + elapsed.courseTitle +"'";
      var html = Spacebars.toHTML(dataContext, Assets.getText('rateCourseEmail.html'));

      var options = { 
        to: email, 
        subject: subject, 
        html: html 
      };
      _deferSendEmail( options );
    });
  },
  sendCourseFullTrainerEmail: function (options) {
    check(options, {
      currentId: String,
      token: String
    });

    var fields = { courseDate: 1, course: 1 };
    var current = Current.findOne( { _id: options.currentId }, { fields: fields } );
    pass = checkExistanceSilent( current, "event", options.currentId, fields );

    if ( ! pass )
      return;

    fields = { title: 1, slug: 1, owner: 1 };
    var course = Courses.findOne( { _id: current.course }, { fields: fields } ); 
    var pass = checkExistanceSilent( course, "course", current.course, fields );

    if ( ! pass )
      return;
    
    var user = Meteor.users.findOne( course.owner );
    if (! user) {
      console.log( "Can't find user with id: " + course.owner );
      return;
    }
    var email = user.getEmail();
    var name = user.getName();

    var url = Meteor.absoluteUrl('course/' + course.slug + '/confirm-event/' + options.token);
    var dataContext = {
      name: name,
      course: course,
      courseDate: moment( current.courseDate[0] ).utcOffset(120).format("DD.MM.YYYY"),
      url: url
    };

    var subject = "Event Bestätigung: '" + course.title +"'";
    var html = Spacebars.toHTML(dataContext, Assets.getText('courseFullTrainerEmail.html'));
    options = { 
      to: email, 
      subject: subject, 
      html: html 
    };
    
    _deferSendEmail( options );
  },
  sendCourseFullParticipantsEmail: function (options) {
    check(options, {
      currentId: String,
      course: String,
      trainerEmail: String,
      trainerName: String,
      begin: String,
      personalMessage: String
    });

    var fields = { title: 1, street: 1, streetNumber: 1, plz: 1, city: 1, streetAdditional: 1, firm: 1 };
    var course = Courses.findOne( { _id: options.course }, { fields: fields } ); 
    var pass = checkExistanceSilent( course, "course", options.course, _.omit( fields, 'streetAdditional', 'firm' ) );

    if ( ! pass )
      return;

    fields = { courseDate: 1, participants: 1 };
    var current = Current.findOne( { _id: options.currentId }, { fields: fields } );
    pass = checkExistanceSilent( current, "event", options.currentId, fields );

    if ( ! pass )
      return;

    var dataContext = {
      course: course,
      courseDate: moment( current.courseDate[0] ).utcOffset(120).format( "DD.MM.YYYY" ),
      trainerEmail: options.trainerEmail,
      trainerName: options.trainerName,
      begin: options.begin,
      personalMessage: options.personalMessage
    };

    _.each( current.participants, function( participant ) {
      var user = Meteor.users.findOne( participant );
      if (! user) {
        console.log( "Can't find user with id: " + participant );
        return;
      }
      var email = user.getEmail();
      var name = user.getName();

      dataContext.name = name;

      var subject = "Event Bestätigung: '" + course.title +"'";
      var html = Spacebars.toHTML(dataContext, Assets.getText('courseFullParticipantsEmail.html'));

      var options = { 
        to: email, 
        subject: subject, 
        html: html 
      };
      
      _deferSendEmail( options );
    });
    // send copy to trainer
    dataContext.name = 'Teilnehmername';

    var subject = "KOPIE für den Trainer: Event Bestätigung: '" + course.title +"'";
    var html = Spacebars.toHTML(dataContext, Assets.getText('courseFullParticipantsEmail.html'));

    options = { 
      to: dataContext.trainerEmail, 
      subject: subject, 
      html: html 
    };
    _deferSendEmail( options );
  }
});

sendBookingConfirmationEmail = function ( options ) {
  check( options, {
    course: String,
    userId: String,
    bookingId: Match.Optional( String ),
    attachBill: Boolean
  });

  var user = Meteor.users.findOne( options.userId );
  if (! user) {
    console.log( "Can't find user with id: " + options.userId );
    return;
  }
  var email = user.getEmail();
  var name = user.getName();

  var fields = { title: 1, slug: 1, description: 1, aims: 1, methods: 1, targetGroup: 1, prerequisites: 1, languages: 1, additionalServices: 1 };
  var course = Courses.findOne( { _id: options.course }, { fields: fields } ); 
  var pass = checkExistanceSilent( course, "course", options.course, { title: 1, slug: 1, description: 1 } );

  if ( ! pass )
    return;

  var url = Meteor.absoluteUrl('course/' + course.slug);
  var dataContext = {
    name: name,
    course: course,
    url: url
  };

  var subject = "Buchungsbestätigung: '" + course.title +"'";
  var html = Spacebars.toHTML(dataContext, Assets.getText('bookingConfirmationEmail.html'));
  var emailOptions = { 
    to: email, 
    subject: subject, 
    html: html 
  };
  if ( options.attachBill )
    _deferGenerateBillAndSendEmail( emailOptions, options.bookingId );
  else
    _deferSendEmail( emailOptions );
};

var _deferSendEmail = function ( options ) {
  Meteor.defer( function() {
    try {
      _sendEmail( options );
      options.to = 'kopie@traincrowd.de';
      _sendEmail( options );
    }
    catch ( error ) {
      console.log( options.to );
      console.log( options.subject );
      console.log( error );
    }
  });
};

_sendEmail = function( options ) {
  var email = {
    to: options.to,
    from: 'info@traincrowd.de',
    subject: options.subject,
    html: options.html
  };
  if ( options.attachments )
    email.attachments = options.attachments;
  Email.send( email );
};