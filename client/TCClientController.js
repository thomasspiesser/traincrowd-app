

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

Template.createCourse.helpers({
  error: function () {
    return Session.get("createError");
  }
});