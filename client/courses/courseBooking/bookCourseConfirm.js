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
      Meteor.call('updateSingleUserField', { argName: 'newsletter', argValue: true }, function ( error, result ) {
        if ( error ) {
          toastr.error( 'Fehler Newsletter: ' + error.reason );
          return false;
        }
      });
    }
    Modal.show( 'payModal', { bookingId: this._id, feePP: this.courseFeePP } );
  }
});