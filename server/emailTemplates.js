// (server-side)
Meteor.startup(function() {
  // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
  Accounts.emailTemplates.from = 'Traincrowd <info@traincrowd.de>';

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = 'Traincrowd';

  // A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Bitte bestätigen Sie noch Ihre Email Adresse';
  };

  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Bitte klicken Sie den folgenden link an, um Ihre Email Adresse zu bestätigen: ' + url;
  };

  Accounts.emailTemplates.resetPassword.subject = function(user) {
    return 'Passwort vergessen?';
  };
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    return 'Guten Tag ' + displayName(user) + ',\n\n' + 'Um Ihr Passwort zurückzusetzen, klicken Sie einfach auf den folgenden Link:\n\n' + url + '\n\n' + 'Vielen Dank.';
  };
  // Accounts.emailTemplates.resetPassword.html = function(user, url) {
  //   return 'bitte den folgenden link anklicken, um Ihre Email Adresse zu bestätigen: ' + url;
  // };
});

Meteor.methods({
  sendRateCourseEmail: function (options) {
    this.unblock();
    check(options, {
      course: String,
      participants: [String]
    });

    var course = Courses.findOne({_id: options.course}, {fields: {title: 1}});
    if (!course)
      throw new Meteor.Error("Can't find course: "+options.course);
    if (!course.title)
      throw new Meteor.Error("Course: " + options.course + " doesn't have a title.");
    var url = Meteor.absoluteUrl('user-courses');
    _.each(options.participants, function(participant) {
      var user = Meteor.users.findOne( participant );
      if (!user) {
        // don't throw new Meteor.Error("Can't find user");
        // still wanna email the others
        console.log("Can't find user: "+participant)
        return; // jump out of current iteration, keeps looping
      }
      if (user.emails && user.emails[0])
        var email = user.emails[0].address;
      else {
        // don't throw new Meteor.Error("Don't have an Email for user: "+participant);
        console.log("Don't have an Email for user: "+participant)
        return;
      }
      var name = displayName(user);

      var dataContext = {
        name: name,
        title: course.title,
        url: url
      }
      var subject = "Bewerten Sie den Kurs: '" + course.title +"'";
      var html = Spacebars.toHTML(dataContext, Assets.getText('rateCourseEmail.html'));

      var options = { 
        to: email, 
        subject: subject, 
        html: html 
      }
      sendEmail(options);
    })
  },
  sendBookingConfirmationEmail: function (options) {
    this.unblock();
    check(options, {
      course: String,
      userId: String
    });
    var user = Meteor.users.findOne( options.userId );
    if (user.emails && user.emails[0])
      var email = user.emails[0].address;
    else
      throw new Meteor.Error("Don't have an Email for user: "+participant);
    var name = displayName(user);

    var course = Courses.findOne( {_id: options.course} ); // specify fields to return or omit
    if (!course)
      throw new Meteor.Error("Can't find course: "+options.course);
    if (!course.title)
      throw new Meteor.Error("Course: " + options.course + " doesn't have a title.");
    var url = Meteor.absoluteUrl('course/'+options.course);
    var dataContext = {
      name: name,
      course: course,
      url: url
    }

    var subject = "Buchungsbestätigung: '" + course.title +"'";
    var html = Spacebars.toHTML(dataContext, Assets.getText('bookingConfirmationEmail.html'));
    var options = { 
        to: email, 
        subject: subject, 
        html: html 
      }
    
    sendEmail(options);
  },
  sendCourseFullTrainerEmail: function (options) {
    this.unblock();
    check(options, {
      currentId: String,
      course: String,
      token: String
    });

    var course = Courses.findOne( {_id: options.course} ); // specify fields to return or omit
    if (!course)
      throw new Meteor.Error("Can't find course: "+options.course);
    if (!course.title)
      throw new Meteor.Error("Course: " + options.course + " doesn't have a title.");
    if (!course.owner)
      throw new Meteor.Error("Course: " + options.course + " doesn't have an owner.");
    
    var owner = Meteor.users.findOne( course.owner );
    if (owner.emails && owner.emails[0])
      var email = owner.emails[0].address;
    else
      throw new Meteor.Error("Don't have an Email for course.owner: "+owner);
    var name = displayName(owner);

    var current = Current.findOne({_id: options.currentId}, { fields: { courseDate:1 } });
    if (!current)
      throw new Meteor.Error("Can't find current: "+options.currentId);
    if (!current.courseDate)
      throw new Meteor.Error("Current: " + options.currentId + " doesn't have a courseDate.");

    var url = Meteor.absoluteUrl('course/'+options.course+'/confirm-event/'+options.token);
    var dataContext = {
      name: name,
      course: course,
      courseDate: moment(current.courseDate[0]).format("DD.MM.YYYY"),
      url: url
    }

    var subject = "Event Bestätigung: '" + course.title +"'";
    var html = Spacebars.toHTML(dataContext, Assets.getText('courseFullTrainerEmail.html'));
    var options = { 
        to: email, 
        subject: subject, 
        html: html 
      }
    
    sendEmail(options);
  },
  sendCourseFullParticipantsEmail: function (options) {
    this.unblock();
    check(options, {
      currentId: String,
      course: String,
      trainerEmail: String,
      trainerName: String,
      street: String,
      streetAdditional: String,
      plz: String,
      personalMessage: String
    });

    var course = Courses.findOne( {_id: options.course} ); // specify fields to return or omit
    if (!course)
      throw new Meteor.Error("Can't find course: "+options.course);
    if (!course.title)
      throw new Meteor.Error("Course: " + options.course + " doesn't have a title.");
    
    var current = Current.findOne({_id: options.currentId}, { fields: { courseDate:1, participants:1 } });
    if (!current)
      throw new Meteor.Error("Can't find current: "+options.currentId);
    if (!current.courseDate)
      throw new Meteor.Error("Current: " + options.currentId + " doesn't have a courseDate.");
    if (!current.participants)
      throw new Meteor.Error("Current: " + options.currentId + " doesn't have participant.");

    var dataContext = {
      course: course,
      courseDate: current.courseDate,
      trainerEmail: options.trainerEmail,
      trainerName: options.trainerName,
      street: options.street,
      streetAdditional: options.streetAdditional,
      plz: options.plz,
      personalMessage: options.personalMessage
    }

    _.each(current.participants, function(participant) {
      var user = Meteor.users.findOne( participant );
      if (!user) {
        // don't throw new Meteor.Error("Can't find user");
        // still wanna email the others
        console.log("Can't find user: "+participant)
        return; // jump out of current iteration, keeps looping
      }
      if (user.emails && user.emails[0])
        var email = user.emails[0].address;
      else {
        // don't throw new Meteor.Error("Don't have an Email for user: "+participant);
        console.log("Don't have an Email for user: "+participant)
        return;
      }
      var name = displayName(user);

      dataContext.name = name

      var subject = "Event Bestätigung: '" + course.title +"'";
      var html = Spacebars.toHTML(dataContext, Assets.getText('courseFullParticipantsEmail.html'));

      var options = { 
        to: email, 
        subject: subject, 
        html: html 
      }
      
      sendEmail(options);
    })
  },
  sendTestEmail: function (options) {
    this.unblock();
    check(options, {
      to: String
    });
    if (this.userId) {
      var user = Meteor.users.findOne( this.userId );
      var name = displayName(user);
    }
    else {
      var name = options.to;
    }
    var subject = 'Traincrowd beta sagt Hallo!';
    var html = Spacebars.toHTML({ name: name }, Assets.getText('exampleHtmlEmail.html'));
    options = _.extend({ subject: subject, html: html }, options);
    
    sendEmail(options);
  }
})

var sendEmail = function (options) {
    // can only be called in this file! 
    Email.send({
      to: options.to,
      from: 'info@traincrowd.de',
      subject: options.subject,
      html: options.html
    });
  }