Template.bookCoursePaymentMethod.events({
	'click #bookCourseSelectPaymentMethod': function (event, template) {
		var paymentMethod = template.find('input:radio[name=book-course-select-payment-method-radio]:checked');
		if (! paymentMethod) {
      toastr.error( "Keine Zahlungsart ausgewählt." );
      return false;
    }
    else 
    	paymentMethod = paymentMethod.value;

		var args = {
		  bookingId: Router.current().params._id,
		  argName: 'paymentMethod',
		  argValue: paymentMethod
		};
		Meteor.call('updateBooking', args, function (error, result) {
		  if (error)
		    toastr.error( error.reason );
		  else {
		    Session.set('bookCourseTemplate', "bookCourseConfirm");

        $('#bookCoursePaymentMethod').children('.progress-tracker').removeClass('active').addClass('inactive');
        $('#bookCourseConfirm').children('.progress-tracker').removeClass('inactive').addClass('active');
		  }
		});
	}
});