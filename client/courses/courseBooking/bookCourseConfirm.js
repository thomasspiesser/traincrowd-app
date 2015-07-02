Template.bookCourseConfirm.helpers({
  // paymentMethod: function () {
  //  return this.paymentMethod === 'creditcard' ? 'Kreditkarte' : 'Rechnung';
  // }
});

Template.bookCourseConfirm.events({
  'click #change-billingAddress': function (event, template) {

    Session.set('bookCourseTemplate', "bookCourseAddress");

    $('#bookCourseConfirm').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#bookCourseAddress').children('.progress-tracker').removeClass('inactive').addClass('active');
  },
  'click #change-paymentMethod': function (event, template) {

    Session.set('bookCourseTemplate', "bookCoursePaymentMethod");

    $('#bookCourseConfirm').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#bookCoursePaymentMethod').children('.progress-tracker').removeClass('inactive').addClass('active');
  }
});