

Template.bookCourseRegister.events({
  'click #bookCourseLogin': function (event, template) {
    Session.set('bookCourseTemplate', "bookCoursePaymentMethod");

    $('#bookCourseRegister').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#bookCoursePaymentMethod').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  },
  'click #bookCourseRegistry': function (event, template) {
    Session.set('bookCourseTemplate', "bookCoursePaymentMethod");

    $('#bookCourseRegister').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#bookCoursePaymentMethod').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  }
});

