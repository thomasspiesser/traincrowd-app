Template.bookCoursePaymentMethod.events({
  'click #book-course-select-paymentMethod': function ( event, template ) {
    var paymentMethod = template.find( 'input:radio[name=book-course-select-payment-method-radio]:checked' );
    if ( ! paymentMethod ) {
      toastr.error( "Keine Zahlungsart ausgewählt." );
      return false;
    }
    else 
      paymentMethod = paymentMethod.value;

    var self = this;
    var args = {
      bookingId: self._id,
      argName: 'paymentMethod',
      argValue: paymentMethod
    };
    Meteor.call( 'updateBooking', args, function ( error, result ) {
      if ( error )
        toastr.error( error.reason );
      else 
        Router.go( "book.course", { _id: self._id, state: "bookCourseConfirm" } );
    });
  }
});