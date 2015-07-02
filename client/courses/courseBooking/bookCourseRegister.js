Template.bookCourseRegister.events({
  'click #book-course-login-button': function (event, template) {
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

    var self = this;

    Meteor.loginWithPassword(email, password, function(error){
      if (error)
        toastr.error( error.reason );
      else {
        if ( ! self.customer ){
          var args = {
            bookingId: self._id,
            argName: 'customer',
            argValue: ''
          };
          Meteor.call('updateBooking', args, function (error, result) {
            if (error)
              toastr.error( error.reason );
          });
        }
        Session.set('bookCourseTemplate', "bookCourseAddress");

        $('#bookCourseRegister').children('.progress-tracker').removeClass('active').addClass('inactive');
        $('#bookCourseAddress').children('.progress-tracker').removeClass('inactive').addClass('active');
      }
    });
  },
  'click #book-course-register-button': function (event, template) {
    var email = template.find('#sign-in-email').value;
    var password = template.find('#sign-in-password').value;

    Accounts.createUser({email: email, password : password}, function(err){
      if (err) {
        Session.set( "createError", "Sorry, "+err.reason );
      } else {
        Session.set( "createError", '' );
        $('#loginModal').modal('hide');
      }
    });

    Session.set('bookCourseTemplate', "bookCourseAddress");

    $('#bookCourseRegister').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#bookCourseAddress').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  }
});

