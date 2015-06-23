Template.bookCoursePaymentMethod.events({
	'click #bookCourseSelectPaymentMethod': function () {
		Session.set('bookCourseTemplate', "bookCourseConfirm");

    $('#bookCoursePaymentMethod').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#bookCourseConfirm').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
	}
});