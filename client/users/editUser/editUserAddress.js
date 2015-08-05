Template.editUserAddress.events({
  'click #saveEditUserAddress': function (event, template) {
    if (! this.profile.billingAddresses[0].street || ! this.profile.billingAddresses[0].streetNumber || ! this.profile.billingAddresses[0].plz || ! this.profile.billingAddresses[0].city) {
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