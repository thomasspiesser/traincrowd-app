Template.bookCourseAddress.onRendered(function () {
  Session.setDefault("bookCourseAddress", 'book-course-address-private');
});


Template.bookCourseAddress.helpers({
  bookCourseAddressBusiness: function () {
    return Session.get('bookCourseAddress') === 'book-course-address-business' ? true : false;
  }
});

Template.bookCourseAddress.events({
  'change input:radio[name=book-course-address-radio]': function (event) {
    Session.set("bookCourseAddress", event.currentTarget.id);
  }
});