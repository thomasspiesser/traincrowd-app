Template.editUserAccount.events({
  'input #edit-user-email': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-user-'+field).parent().removeClass('has-error');
    $('#help-text-edit-user-'+field).text('speichern...').fadeIn(300);
    // if (! EMAIL_REGEX.test( event.currentTarget.value )) {
    //   toastr.error( "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben." );
    //   return false;
    // } 
    lazysaveUserField( { argName: field, argValue: event.currentTarget.value } );
  },
  'click #changeUserPassword': function (event, template) {
    var passwordNew = template.find("#edit-user-password-new").value;
    var passwordNewAgain = template.find("#edit-user-password-new-again").value;
    var passwordOld = template.find("#edit-user-password-old").value;

    if (passwordNew.length && passwordNew !== passwordNewAgain) {
      toastr.error( "Bitte überprüfen Sie, ob Sie tatsächlich zweimal das gleich Passwort eingegeben haben." );
      $('#edit-user-password-new').val('');
      $('#edit-user-password-new-again').val('');
      $('#edit-user-password-old').val('');
      return false;
    }

    if (passwordNew.length) {
      Accounts.changePassword(passwordOld, passwordNew, function (error, result) {
        if (error) {
          toastr.error( error.reason );
          $('#edit-user-password-new').val('');
          $('#edit-user-password-new-again').val('');
          $('#edit-user-password-old').val('');
          return false;
        }
        else {
          toastr.success( "Passwort geändert." );
          $('#edit-user-password-new').val('');
          $('#edit-user-password-new-again').val('');
          $('#edit-user-password-old').val('');
          return false;
        }
      });
    }
  },
  'click #deleteMyAccount': function () {
    if (confirm('Benutzer Konto wirklich löschen? \nDiese Aktion kann nicht rückgängig gemacht werden.') ) {
      Meteor.call('deleteMyAccount', function (error, result) {
        if (error) {
          toastr.error( error.reason );
        }
        else {
          Router.go('home');
        }
      });
    }
  }
});