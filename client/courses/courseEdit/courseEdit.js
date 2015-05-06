Template.editCourse.created = function () {
  Session.set("editCourseTemplate", "editCourseDescription");
};

Template.editCourse.helpers({
  deservesCheckCourseDescription: function () {
    return this.title && this.description && this.categories ? true : false;
  },
  deservesCheckCourseDetails: function () {
    return this.aims ? true : false;
  },
  deservesCheckCourseCosts: function () {
    return this.maxParticipants && this.fee ? true : false;
  },
  deservesCheckCourseDates: function () {
    return this.duration && this.expires ? true : false;
  },
  deservesCheckCourseLogistics: function () {
    return this.noLocation || this.street ? true : false;
  },
  active: function() {
    return Session.get('editCourseTemplate');
  }
});

Template.editCourse.events({ 
  'click .dynamic-template-selector': function (event) {
    Session.set('editCourseTemplate', event.currentTarget.id);

    $('.progress-tracker').removeClass('active').addClass('inactive');
    $(event.currentTarget).children('.progress-tracker').removeClass('inactive').addClass('active');
  }
});