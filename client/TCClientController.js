var canEditHelper = { 
  canEdit: function () {
    return this.owner === Meteor.userId();
  } }

var errorHelper = {
  error: function () {
    return Session.get("createError");
  }
}

Template.courseDetail.helpers( canEditHelper );

Template.courseDetail.events({
  'click #editCourseButton': function (event, template) {
    Router.go("course.edit", {_id: this._id} );
  }
});

Template.editCourse.helpers( canEditHelper );
Template.editCourse.helpers( errorHelper );

Template.editCourse.events({
  'click #editCourseButton': function (event, template) {
    var title = template.find("#inputTitleCourse").value;
    var description = template.find("#inputDescriptionCourse").value;
    var maxParticipants = parseInt(template.find("#inputMaxNrParticipantsCourse").value);
    var public = template.find("#publishCourse").checked;

    if (title.length && description.length && maxParticipants > 1) {
      Courses.update(this._id, {modifier}, callback);

      Session.set("selectedCourse", id);
      Session.set("createError", "");
      Router.go("course.show", {_id: this._id} );
    } else {
      Session.set("createError",
                  "Please, fill out the entire form!");
    }
    return false
  },
  'click removeCourseButton': function () {
    Courses.remove(this._id);
  }
});


Template.createCourse.events({
  'click #createCourseButton': function (event, template) {
    var title = template.find("#inputTitleCourse").value;
    var description = template.find("#inputDescriptionCourse").value;
    var maxParticipants = parseInt(template.find("#inputMaxNrParticipantsCourse").value);
    var public = template.find("#publishCourse").checked;

    if (title.length && description.length && maxParticipants > 1) {
      var id = createCourse({
        title: title,
        description: description,
        maxParticipants: maxParticipants,
        public: public
      });
      Session.set("selectedCourse", id);
      Session.set("createError", "");
      Router.go("course.show", {_id: id} );
    } else {
      Session.set("createError",
                  "Please, fill out the entire form!");
    }
    return false
  }
});

Template.createCourse.helpers( errorHelper );