Template.bookCourseConfirm.helpers({
  niceDate: function () {
    return moment(this).format("DD.MM.YYYY");
  }
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
  },
  'click #change-contact': function (event, template) {
    Modal.show('editContactModal');
    
  },
  'click #book-course-pay': function (event, template) {
    var agb = template.find('#accept-agb').checked;
    if ( ! agb ) {
      toastr.error( "Sie müssen die ABGs akzeptieren." );
      return false;
    }
    Modal.show('payModal', { feePP: this.courseFeePP });
  }
});