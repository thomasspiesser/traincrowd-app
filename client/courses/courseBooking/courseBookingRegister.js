Template.bookCourseRegister.events({
  'click #bookCourseLoginButton': function (event, template) {
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

    Meteor.loginWithPassword(email, password, function(error){
      if (error) {
        toastr.error( error.reason );
        return false;
      }
      else {
        Session.set('bookCourseTemplate', "bookCoursePaymentMethod");

        $('#bookCourseRegister').children('.progress-tracker').removeClass('active').addClass('inactive');
        $('#bookCoursePaymentMethod').children('.progress-tracker').removeClass('inactive').addClass('active');
        var user = Meteor.user();
        if ( ! user.profile.street || ! user.profile.streetNumber || ! user.profile.plz || ! user.profile.city ) {
          Modal.show('editAddressModal');
        }
      }
    });
  },
  'click #bookCourseRegisterButton': function (event, template) {
    Session.set('bookCourseTemplate', "bookCoursePaymentMethod");

    $('#bookCourseRegister').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#bookCoursePaymentMethod').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  }
});

