Template.navItems.helpers({
  activeIfTemplateIs: function (template) {
    var currentRoute = Router.current();
    return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
  }
});

Template.createCourse.events({
  'click #createCourseButton': function (event, template) {
    e.preventDefault();
    var title = template.find("#inputTitleCourse").value;
    var description = template.find("#inputDescriptionCourse").value;
    var maxParticipants = template.find("#inputMaxNrParticipantsCourse").value;
    var public = template.find("#publishCourse").checked;

    var id = createParty({
      title: title,
      description: description,
      maxParticipants: maxParticipants,
      public: public
    });

    Session.set("selectedCourse", id);
    // Router.go("/")
  }
});