Meteor.startup(function() {

  Accounts.emailTemplates.from = 'traincrowd <info@traincrowd.de>';

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = 'traincrowd';

  // A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function( user ) {
    return 'Bitte bestätigen Sie noch Ihre Email Adresse';
  };
  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function( user, url ) {
    return 'Bitte klicken Sie den folgenden link an, um Ihre Email Adresse zu bestätigen: ' + url;
  };

  Accounts.emailTemplates.resetPassword.subject = function( user ) {
    return 'Passwort vergessen?';
  };
  Accounts.emailTemplates.resetPassword.text = function( user, url ) {
    return 'Guten Tag ' + displayName(user) + ',\n\n' + 'Um Ihr Passwort zurückzusetzen, klicken Sie einfach auf den folgenden Link:\n\n' + url + '\n\n' + 'Vielen Dank.\n';
  };
  Accounts.emailTemplates.enrollAccount.subject = function( user ) {
    return "Es wurde für Sie auf " + Accounts.emailTemplates.siteName + " ein Account angelegt";
  };
  Accounts.emailTemplates.enrollAccount.text = function( user, url ) {
    return 'Guten Tag ' + displayName(user) + ',\n\n' + 'Um Ihren neuen Account zu Nutzen, klicken Sie einfach auf den folgenden Link:\n\n' + url + '\n\n' + 'Viel Spass.\n';
  };
});

Meteor.methods({
  // sendTestMail: function ( error, delay ) {

  //   Meteor._sleepForMs( delay );
    
  //   if ( error )
  //     throw new Meteor.Error(123, 'Error: test');

  //   var subject = "testmail";
  //   options = { 
  //     to: 'thomas@herro', 
  //     // to: 'thomas@traincrowd.de', 
  //     subject: subject, 
  //     text: "testmail" 
  //   };
    
  //   console.log('sending mail now...');

  //   sendEmail(options);

  //   console.log('after send...');
    
  // },
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
    
    Meteor.defer( function() {
      try {
        sendEmail( options );
      }
      catch ( error ) {
        console.log( options.to );
        console.log( options.subject );
        console.log( error );
      }
    });
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
    
    var owner = Meteor.users.findOne( course.owner );
    var email;
    if (owner.emails && owner.emails[0])
      email = owner.emails[0].address;
    else {
      console.log("Don't have an Email for course.owner: " + owner);
      return;
    }
    var name = displayName( owner );

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
      courseDate: moment( current.courseDate[0] ).utcOffset(60).format("DD.MM.YYYY"),
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
    
    Meteor.defer( function() {
      try {
        sendEmail( options );
        options.to = 'kopie@traincrowd.de';
        sendEmail( options );
      }
      catch ( error ) {
        console.log( options.to );
        console.log( options.subject );
        console.log( error );
      }
    });
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
    
    var email;
    var owner = Meteor.users.findOne( course.owner );
    if (owner.emails && owner.emails[0])
      email = owner.emails[0].address;
    else {
      console.log("Don't have an Email for course.owner: " + owner);
      return;
    }
    var name = displayName(owner);

    fields = { courseDate: 1 };
    var current = Current.findOne( { _id: options.currentId }, { fields: fields } );
    pass = checkExistanceSilent( current, "event", options.currentId, fields );

    if ( ! pass )
      return;

    var dataContext = {
      name: name,
      course: course,
      courseDate: moment( current.courseDate[0] ).utcOffset(60).format("DD.MM.YYYY")
    };

    var subject = "Ihr Kurs: '" + course.title + "'" + " ist leider nicht voll geworden.";
    var html = Spacebars.toHTML(dataContext, Assets.getText('informEventExpiredTrainerEmail.html'));
    options = { 
        to: email, 
        subject: subject, 
        html: html 
      };
    
    Meteor.defer( function() {
      try {
        sendEmail( options );
        options.to = 'kopie@traincrowd.de';
        sendEmail( options );
      }
      catch ( error ) {
        console.log( options.to );
        console.log( options.subject );
        console.log( error );
      }
    });
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
      if (!user) {
        // don't throw new Meteor.Error("Can't find user");
        // still wanna email the others
        console.log("Can't find user: " + participant);
        return; // jump out of current iteration, keeps looping
      }
      var email;
      if (user && user.emails && user.emails[0])
        email = user.emails[0].address;
      else {
        // don't throw new Meteor.Error("Don't have an Email for user: "+participant);
        console.log("Don't have an Email for user: " + participant);
        return;
      }
      var name = displayName(user);

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
      
      Meteor.defer( function() {
        try {
          sendEmail( options );
          options.to = 'kopie@traincrowd.de';
          sendEmail( options );
        }
        catch ( error ) {
          console.log( options.to );
          console.log( options.subject );
          console.log( error );
        }
      });
    });
  },
  sendRateCourseEmail: function (options) {
    check(options, {
      course: String,
      participants: [String]
    });

    var fields = { title: 1 };
    var course = Courses.findOne( { _id: options.course }, { fields: fields } ); 
    var pass = checkExistanceSilent( course, "course", options.course, fields );

    if ( ! pass )
      return;

    var url = Meteor.absoluteUrl('user-courses');
    _.each(options.participants, function(participant) {
      var user = Meteor.users.findOne( participant );
      if ( ! user ) {
        // don't throw new Meteor.Error("Can't find user");
        // still wanna email the others
        console.log("Can't find user: "+participant);
        return; // jump out of current iteration, keeps looping
      }
      var email;
      if (user && user.emails && user.emails[0])
        email = user.emails[0].address;
      else {
        // don't throw new Meteor.Error("Don't have an Email for user: "+participant);
        console.log("Don't have an Email for user: "+participant);
        return;
      }
      var name = displayName(user);

      var dataContext = {
        name: name,
        title: course.title,
        url: url
      };
      var subject = "Bewerten Sie den Kurs: '" + course.title +"'";
      var html = Spacebars.toHTML(dataContext, Assets.getText('rateCourseEmail.html'));

      var options = { 
        to: email, 
        subject: subject, 
        html: html 
      };
      Meteor.defer( function() {
        try {
          sendEmail( options );
          options.to = 'kopie@traincrowd.de';
          sendEmail( options );
        }
        catch ( error ) {
          console.log( options.to );
          console.log( options.subject );
          console.log( error );
        }
      });
    });
  },
  sendCourseFullTrainerEmail: function (options) {
    check(options, {
      currentId: String,
      course: String,
      token: String
    });

    var fields = { title: 1, slug: 1, owner: 1 };
    var course = Courses.findOne( { _id: options.course }, { fields: fields } ); 
    var pass = checkExistanceSilent( course, "course", options.course, fields );

    if ( ! pass )
      return;
    
    var owner = Meteor.users.findOne( course.owner );
    var email;
    if (owner.emails && owner.emails[0])
      email = owner.emails[0].address;
    else {
      console.log("Don't have an Email for user: " + owner );
      return;
    }
    var name = displayName(owner);

    fields = { courseDate: 1 };
    var current = Current.findOne( { _id: options.currentId }, { fields: fields } );
    pass = checkExistanceSilent( current, "event", options.currentId, fields );

    if ( ! pass )
      return;

    var url = Meteor.absoluteUrl('course/' + course.slug + '/confirm-event/' + options.token);
    var dataContext = {
      name: name,
      course: course,
      courseDate: moment( current.courseDate[0] ).utcOffset(60).format("DD.MM.YYYY"),
      url: url
    };

    var subject = "Event Bestätigung: '" + course.title +"'";
    var html = Spacebars.toHTML(dataContext, Assets.getText('courseFullTrainerEmail.html'));
    options = { 
        to: email, 
        subject: subject, 
        html: html 
      };
    
    Meteor.defer( function() {
      try {
        sendEmail( options );
        options.to = 'kopie@traincrowd.de';
        sendEmail( options );
      }
      catch ( error ) {
        console.log( options.to );
        console.log( options.subject );
        console.log( error );
      }
    });
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
      courseDate: moment( current.courseDate[0] ).utcOffset(60).format( "DD.MM.YYYY" ),
      trainerEmail: options.trainerEmail,
      trainerName: options.trainerName,
      begin: options.begin,
      personalMessage: options.personalMessage
    };

    _.each( current.participants, function( participant ) {
      var user = Meteor.users.findOne( participant );
      if ( ! user ) {
        // don't throw new Meteor.Error("Can't find user");
        // still wanna email the others
        console.log( "Can't find user: " + participant );
        return; // jump out of current iteration, keeps looping
      }
      var email;
      if ( user && user.emails && user.emails[0] )
        email = user.emails[0].address;
      else {
        // don't throw new Meteor.Error("Don't have an Email for user: "+participant);
        console.log( "Don't have an Email for user: " + participant);
        return;
      }
      var name = displayName( user );

      dataContext.name = name;

      var subject = "Event Bestätigung: '" + course.title +"'";
      var html = Spacebars.toHTML(dataContext, Assets.getText('courseFullParticipantsEmail.html'));

      var options = { 
        to: email, 
        subject: subject, 
        html: html 
      };
      
      Meteor.defer( function() {
        try {
          sendEmail( options );
          options.to = 'kopie@traincrowd.de';
          sendEmail( options );
        }
        catch ( error ) {
          console.log( options.to );
          console.log( options.subject );
          console.log( error );
        }
      });
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
    Meteor.defer( function() {
      try {
        sendEmail( options );
        options.to = 'kopie@traincrowd.de';
        sendEmail( options );
      }
      catch ( error ) {
        console.log( options.to );
        console.log( options.subject );
        console.log( error );
      }
    });
  }
});

sendBookingConfirmationEmail = function ( options ) {
  check( options, {
    course: String,
    userId: String
  });

  var user = Meteor.users.findOne( options.userId );
  var email;
  if ( user && user.emails && user.emails[0] )
    email = user.emails[0].address;
  else {
    console.log( "Don't have an Email for user: " + options.userId );
    return;
  }
  var name = displayName( user );

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
  options = { 
      to: email, 
      subject: subject, 
      html: html 
    };

  Meteor.defer( function() {
    try {
      sendEmail( options );
      options.to = 'kopie@traincrowd.de';
      sendEmail( options );
    }
    catch ( error ) {
      console.log( options.to );
      console.log( options.subject );
      console.log( error );
    }
  });
};

var sendEmail = function (options) {
  // can only be called in this file! 
  Email.send({
    to: options.to,
    from: 'info@traincrowd.de',
    subject: options.subject,
    html: options.html
  });
};