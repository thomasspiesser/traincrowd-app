Template.editTrainerAddress.events({
  'input .edit-trainer': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-user-'+field).parent().removeClass('has-error');
    $('#help-text-edit-user-'+field).text('speichern...').fadeIn(300);
    lazysaveUserField( { argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditTrainerAddress': function (event, template) {
    if (! this.profile.billingAddresses[0].street || ! this.profile.billingAddresses[0].streetNumber || ! this.profile.billingAddresses[0].plz || ! this.profile.billingAddresses[0].city) {
      $('.form-group').addClass('has-error');
      $('#help-text-edit-street').text('Bitte geben Sie eine vollständige Rechnungsadresse an.').fadeIn(300);
      toastr.error( "Bitte machen Sie vollständige Angaben zu Ihrer Adresse." );
      return false;
    }

    Session.set('editTrainerTemplate', "editTrainerAccount");

    $('#editTrainerAddress').parent().removeClass('active');
    $('#editTrainerAccount').parent().addClass('active');

    return false;
  }
});

Template.editTrainerAddress.events( hoverCheckEvents );