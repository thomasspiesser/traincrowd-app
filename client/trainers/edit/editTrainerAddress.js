Template.editTrainerAddress.events({
  'input .edit-trainer': function ( event, template ) {
    var field = event.currentTarget.id.split( '-' )[2];
    $( '#edit-user-' + field ).parent().removeClass( 'has-error' );
    $( '#help-text-edit-user-' + field ).text( 'speichern...' ).fadeIn( 300 );
    lazysaveUserField( { argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditTrainerAddress': function ( event, template ) {
    var address = this.profile.billingAddresses[0];
    if ( ! address || ! address.street || ! address.streetNumber || ! address.plz || ! address.city ) {
      $('.edit-address').parent().addClass('has-error');
      $('#help-text-edit-street').text('Bitte geben Sie eine vollständige Rechnungsadresse an.').fadeIn(300);
      toastr.error( "Bitte machen Sie vollständige Angaben zu Ihrer Adresse." );
      return false;
    }
    else
      $('.edit-address').parent().removeClass('has-error');

    if ( ! this.profile.taxNumber ) {
      $('#edit-user-taxNumber').parent().addClass('has-error');
      $('#help-text-edit-user-taxNumber').text('Bitte geben Sie Ihre Steuernummer an.').fadeIn(300);
      toastr.error( "Bitte geben Sie Ihre Steuernummer an." );
      return false;
    }

    Session.set('editTrainerTemplate', "editTrainerAccount");

    $('#editTrainerAddress').parent().removeClass('active');
    $('#editTrainerAccount').parent().addClass('active');

    return false;
  }
});

Template.editTrainerAddress.events( hoverCheckEvents );