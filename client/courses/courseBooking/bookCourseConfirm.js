Template.bookCourseConfirm.events({
  'click #change-billingAddress': function ( event, template ) {
    Session.set('bookCourseTemplate', "bookCourseAddress");

    $('#bookCourseConfirm').parent().removeClass('active');
    $('#bookCourseAddress').parent().addClass('active');
  },
  'click #change-paymentMethod': function ( event, template ) {
    Session.set('bookCourseTemplate', "bookCoursePaymentMethod");

    $('#bookCourseConfirm').parent().removeClass('active');
    $('#bookCoursePaymentMethod').parent().addClass('active');
  },
  'click #change-contact': function ( event, template ) {
    Modal.show('editContactModal');
  },
  'click #agb-link': function () {
    Modal.show('agbModal');
  },
  'click #book-course-pay': function ( event, template ) {
    if ( ! Meteor.userId() ){
      toastr.error( "Sie müssen eingeloggt sein." );
      return false;
    }
    var agb = template.find('#accept-agb').checked;
    if ( ! agb ) {
      toastr.error( "Sie müssen die ABGs akzeptieren." );
      return false;
    }
    if ( template.find('#subscribe-newsletter').checked ) {
      Meteor.call( 'updateSingleUserField', { argName: 'newsletter', argValue: true }, function ( error, result ) {
        if ( error ) {
          toastr.error( 'Fehler Newsletter: ' + error.reason );
          return false;
        }
      });
    }
    var bookingId = this._id;
    switch ( this.paymentMethod ) {
      case 'Rechnung':
        Meteor.call( 'createInvoice', { bookingId: bookingId }, function ( error, result ) {
          if ( error )
            toastr.error( error.reason );
          else {
            toastr.success('Buchung erfolgreich.');
            Session.set('bookCourseTemplate', "bookCourseShare");

            $('#bookCourseConfirm').parent().removeClass('active');
            $('#bookCourseShare').parent().addClass('active');
          }
        });
        break;
      case 'Kreditkarte':
        Modal.show( 'payModal', { bookingId: bookingId, feePP: this.courseFeePP } );
        break;
    }
  }
});