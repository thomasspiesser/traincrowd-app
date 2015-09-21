var self;

Template.noPayModal.events({
  'click #forgot-password-link, click #agb-link, click #privacy-link': function () {
    Modal.hide('noPayModal');
  },
  'click #no-pay-course-login-button': function (event, template) {
    var email = template.find('#sign-in-email').value;
    var password = template.find('#sign-in-password').value;

    if ( ! EMAIL_REGEX.test( email ) ) {
      formFeedbackError( '#sign-in-email', '#help-text-sign-in-email', 'Bitte geben Sie eine valide Email-Adresse an.', "Das ist keine valide Email." );
      return false;
    }

    if ( ! password.length ) {
      formFeedbackError( '#sign-in-password', '#help-text-sign-in-password', 'Bitte geben Sie Ihr Passwort an.', "Das Passwort darf nicht leer sein." );
      return false;
    }

    self = this;

    Meteor.loginWithPassword(email, password, function(error){
      if ( error )
        toastr.error( error.reason );
      else {
        // has no customer yet: update
        if ( ! self.customer ) {
          var args = {
            bookingId: self._id,
            argName: 'customer',
            argValue: ''
          };
          Meteor.call('updateBooking', args, function (error, result) {
            if ( error )
              toastr.error( error.reason );
            else
              Router.go( "book.course", { _id: self._id, state: "bookCourseAddress" } );
          });
        }
        // has customer and it's the user -> just proceed
        else if ( self.customer && self.customer === Meteor.userId() )
          Router.go( "book.course", { _id: self._id, state: "bookCourseAddress" } );
        // has customer and it's not the current user -> go create new booking for him
        else if ( self.customer && self.customer !== Meteor.userId() ) {
          Meteor.call('createBooking', self.eventId, self.course, function ( error, result ) {
            if ( error )
              toastr.error( error.reason );
            else
              Router.go('book.course', { _id: result, state: "bookCourseAddress" } );
          });
        }
      }
    });
  },
  'click #no-pay-course-register-button': function (event, template) {
    var email = template.find('#sign-up-email').value;
    var emailAgain = template.find('#sign-up-email-again').value;
    var password = template.find('#sign-up-password').value;
    var passwordAgain = template.find('#sign-up-password-again').value;
    var title = template.find('#sign-up-title').value;
    var name = template.find('#sign-up-name').value;

    $('.form-control').parent().removeClass('has-error');
    $('.help-block').text('');

    if ( ! name.length ) {
      formFeedbackError( '#sign-up-name', '#help-text-sign-up-name', 'Bitte geben Sie Ihren Namen an.', "Der Name darf nicht leer sein." );
      return false;
    }

    if ( ! EMAIL_REGEX.test( email ) ) {
      formFeedbackError( '#sign-up-email', '#help-text-sign-up-email', 'Bitte geben Sie eine valide Email-Adresse an.', "Das ist keine valide Email." );
      return false;
    }

    if ( ! EMAIL_REGEX.test( emailAgain ) ) {
      formFeedbackError( '#sign-up-email-again', '#help-text-sign-up-email-again', 'Bitte geben Sie eine valide Email-Adresse an.', "Das ist keine valide Email." );
      return false;
    }

    if ( email !== emailAgain ) {
      formFeedbackError( '#sign-up-email', '#help-text-sign-up-email', 'Bitte überprüfen Sie, ob Sie tatsächlich zweimal die gleiche Email eingegeben haben.', "Bitte überprüfen Sie, ob Sie tatsächlich zweimal die gleiche Email eingegeben haben." );
      return false;
    }

    if ( ! password.length ) {
      formFeedbackError( '#sign-up-password', '#help-text-sign-up-password', 'Bitte geben Sie ein Passwort an.', "Das Passwort darf nicht leer sein." );
      $('#sign-up-password').val('');
      $('#sign-up-password-again').val('');
      return false;
    }

    if ( password !== passwordAgain ) {
      formFeedbackError( '#sign-up-password', '#help-text-sign-up-password', 'Bitte überprüfen Sie, ob Sie tatsächlich zweimal das gleiche Passwort eingegeben haben.', "Bitte überprüfen Sie, ob Sie tatsächlich zweimal das gleiche Passwort eingegeben haben." );
      $('#sign-up-password').val('');
      $('#sign-up-password-again').val('');
      return false;
    }

    self = this;

    var profile = {
      title: title,
      name: name
    };

    var hash = Accounts._hashPassword(password);

    var options = {
      email: email,
      password: hash,
      profile: profile
    };

    Meteor.call('createUserServer', options, function (error, result) {
      if ( error )
        toastr.error( error.reason );
      if ( result ) {
        Meteor.loginWithPassword(email, password, function( error ){
          if (error)
            toastr.error( error.reason );
          else {
            // has no customer yet: update
            if ( ! self.customer ) {
              var args = {
                bookingId: self._id,
                argName: 'customer',
                argValue: ''
              };
              Meteor.call('updateBooking', args, function (error, result) {
                if ( error )
                  toastr.error( error.reason );
                else
                  Router.go( "book.course", { _id: self._id, state: "bookCourseAddress" } );
              });
            }
            // has customer and it's the user -> just proceed
            else if ( self.customer && self.customer === Meteor.userId() )
              Router.go( "book.course", { _id: self._id, state: "bookCourseAddress" } );
            // has customer and it's not the current user -> go create new booking for him
            else if ( self.customer && self.customer !== Meteor.userId() ) {
              Meteor.call('createBooking', self.eventId, self.course, function ( error, result ) {
                if ( error )
                  toastr.error( error.reason );
                else
                  Router.go('book.course', { _id: result, state: "bookCourseAddress" } );
              });
            }
          }
        });
      }
    });
  }
});