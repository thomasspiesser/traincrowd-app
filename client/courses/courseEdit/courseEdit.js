Template.editCourse.created = function () {
  Session.set("editCourseTemplate", "editCourseDescription");
};

Template.editCourse.helpers({
  active: function() {
    return Session.get('editCourseTemplate');
  }
});

Template.editCourse.events({ 
  'click .dynamic-template-selector': function (event) {
    Session.set('editCourseTemplate', event.currentTarget.id);

    $('.progress-tracker').removeClass('active').addClass('inactive');
    $(event.currentTarget).children('.progress-tracker').removeClass('inactive').addClass('active');
  },
  'click #removeCourseButton': function (event, template) {
    Courses.remove(this._id);
    Router.go("/courses");
  },
  'click #previewCourseButton': function (event, template) {
    Router.go("course.show", {slug: this.slug} );
  }
});