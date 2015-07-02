Template.editUserAccount.helpers({
  email: function () {
    return this.emails[0].address;
  }
});

Template.editUserAccount.events({
  'click #changeUserPassword': function (event, template) {
    var passwordNew = template.find("#edit-user-password-new").value;
    var passwordNewAgain = template.find("#edit-user-password-new-again").value;
    var passwordOld = template.find("#edit-user-password-old").value;

    if (!passwordNew.length) {
      toastr.error( "Sie müssen ein neues Passwort eingeben." );
      $('#edit-user-password-new').val('');
      $('#edit-user-password-new-again').val('');
      $('#edit-user-password-old').val('');
      return false;
    }

    if ( passwordNew !== passwordNewAgain ) {
      toastr.error( "Bitte überprüfen Sie, ob Sie tatsächlich zweimal das gleiche Passwort eingegeben haben." );
      $('#edit-user-password-new').val('');
      $('#edit-user-password-new-again').val('');
      $('#edit-user-password-old').val('');
      return false;
    }

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