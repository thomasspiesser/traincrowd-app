Template.editTrainerAddress.events({
  'input .edit-trainer': function (event, template) {
    var field = event.currentTarget.id.split('-')[1];
    $('#edit-'+field).parent().removeClass('has-error');
    $('#help-text-edit-'+field).text('speichern...').fadeIn(300);
    lazysaveField( 'User', { id: "", argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditTrainerAddress': function (event, template) {
    if (! this.profile.street || ! this.profile.streetNumber || ! this.profile.plz || ! this.profile.city) {
      $('.form-group').addClass('has-error');
      $('#help-text-edit-street').text('Bitte geben Sie eine vollständige Rechnungsadresse an.').fadeIn(300);
      toastr.error( "Bitte machen Sie vollständige Angaben zu Ihrer Adresse." );
      return false;
    }

    Session.set('editTrainerTemplate', "editTrainerAccount");

    $('#editTrainerAddress').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editTrainerAccount').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  }
});

Template.editTrainerAddress.events( hoverCheckEvents );