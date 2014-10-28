Template.navItems.helpers({
  activeIfTemplateIs: function (template) {
    var currentRoute = Router.current();
    return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
  }
});

Template.courseList.helpers({
  courses: function () {
    var courses = Courses.find()
    return courses
  }
});

Template.createCourse.events({
  'click #createCourseButton': function (event, template) {
    console.log('clicked')
    event.preventDefault();
    var title = template.find("#inputTitleCourse").value;
    var description = template.find("#inputDescriptionCourse").value;
    var maxParticipants = parseInt(template.find("#inputMaxNrParticipantsCourse").value);
    var public = template.find("#publishCourse").checked;

    if (title.length && description.length && maxParticipants > 1) {
      console.log('insert')
      var id = createCourse({
        title: title,
        description: description,
        maxParticipants: maxParticipants,
        public: public
      });
      Session.set("selectedCourse", id);
      Session.set("createError", "");
      // Router.go("/courseDetail")
    } else {
      Session.set("createError",
                  "Please, fill out the entire form!");
    }
  }
});

Template.createCourse.helpers({
  error: function () {
    return Session.get("createError");
  }
});