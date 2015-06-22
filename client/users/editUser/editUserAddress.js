Template.editUserAddress.events({
  'click #saveEditUserAddress': function (event, template) {
    if (! this.profile.street || ! this.profile.streetNumber || ! this.profile.plz || ! this.profile.city) {
      $('.form-group').addClass('has-error');
      $('#help-text-edit-user-street').text('Bitte geben Sie eine vollständige Rechnungsadresse an.').fadeIn(300);
      toastr.error( "Bitte machen Sie vollständige Angaben zu Ihrer Adresse." );
      return false;
    }

    Session.set('editUserTemplate', "editUserAccount");

    $('#editUserAddress').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editUserAccount').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  }
});