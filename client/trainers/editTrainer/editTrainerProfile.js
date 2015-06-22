Template.editTrainerProfile.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[1];
    $('#edit-'+field).parent().removeClass('has-error');
    $('#help-text-edit-'+field).text('speichern...').fadeIn(300);
    lazysaveField( 'User', { id: "", argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditTrainerProfile': function (event, template) {
    if (! this.profile.name || ! this.profile.name.length ) {
      formFeedbackError( '#edit-name', '#help-text-edit-name', 'Bitte tragen Sie hier Ihren Namen ein.', "Sie müssen einen Namen angeben." );
      return false;
    }

    if (! this.profile.description || ! this.profile.description.length ) {
      formFeedbackError( '#edit-description', '#help-text-edit-description', 'Bitte tragen Sie hier Ihre Kurzbeschreibung ein.', "Sie müssen eine Kurzbeschreibung angeben." );
      return false;
    }

    Session.set('editTrainerTemplate', "editTrainerAddress");

    $('#editTrainerProfile').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editTrainerAddress').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  }
});

Template.editTrainerProfile.events( hoverCheckEvents );
