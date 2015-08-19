Template.bookCourse.rendered = function () {
  if ( ! Meteor.userId() )
    Session.set( "bookCourseTemplate", "bookCourseRegister" );
  else {
    Session.set( "bookCourseTemplate", "bookCourseAddress" );
    $('.dynamic-template-selector').parent().removeClass('active');
    $('#bookCourseAddress').parent().addClass('active');
  }
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
    return this.maxParticipants && this.fee ? true : false;
  },
  active: function() {
    return Session.get( 'bookCourseTemplate' );
  }
});