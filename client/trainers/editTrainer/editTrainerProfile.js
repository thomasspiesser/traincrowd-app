Template.editTrainerProfile.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-trainer-'+field).parent().removeClass('has-error');
    $('#help-text-edit-trainer-'+field).text('speichern...').fadeIn(300);
    lazysaveUserField( { argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditTrainerProfile': function (event, template) {
    if (! this.profile.name || ! this.profile.name.length ) {
      formFeedbackError( '#edit-trainer-name', '#help-text-edit-trainer-name', 'Bitte tragen Sie hier Ihren Namen ein.', "Sie müssen einen Namen angeben." );
      return false;
    }

    if (! this.profile.description || ! this.profile.description.length ) {
      formFeedbackError( '#edit-trainer-description', '#help-text-edit-trainer-description', 'Bitte tragen Sie hier Ihre Kurzbeschreibung ein.', "Sie müssen eine Kurzbeschreibung angeben." );
      return false;
    }

    Session.set('editTrainerTemplate', "editTrainerAddress");

    $('#editTrainerProfile').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editTrainerAddress').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  }
});

Template.editTrainerProfile.events( hoverCheckEvents );
