Template.bookCourse.rendered = function () {
  $('.dynamic-template-selector').parent().removeClass('active');
  $('#'+ Router.current().params.state ).parent().addClass('active');
};

Template.bookCourse.helpers({
  deservesCheckBookCourseRegister: function () {
    return Meteor.userId() ? true : false;
  },
  deservesCheckBookCourseAddress: function () {
    if ( ! this.billingAddress ) 
      return false;
    var address = this.billingAddress;
    return address.street || address.streetNumber || address.plz || address.city ? true : false;
  },
  deservesCheckBookCoursePaymentMethod: function () {
    return this.paymentMethod ? true : false;
  },
  deservesCheckBookCourseConfirm: function () {
    return this.transaction && this.bookingStatus === 'completed' ? true : false;
  },
  deservesCheckBookCourseShare: function () {
    return this.hasShared ? true : false;
  },
  active: function() {
    var activeRoute = Router.current().params.state;
    $('.dynamic-template-selector').parent().removeClass('active');
    $('#'+ activeRoute ).parent().addClass('active');
    return Router.current().params.state;
  }
});