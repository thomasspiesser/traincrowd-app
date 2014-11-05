Template.userProfile.events({
  'click #editUserProfileButton': function () {
    Router.go("userProfile.edit", {_id: this._id} );
  }
});

//////////// editUserProfile template /////////

Template.editUserProfile.helpers( errorHelper );

Template.editUserProfile.events({ 
  'click #saveChangesUserProfile': function (event, template) {
    var firstName = template.find("#inputTitleCourse").value;
    var lastName = template.find("#inputTitleCourse").value;
    var about = template.find("#inputDescriptionCourse").value;
    var phone = template.find("#inputDescriptionCourse").value;
    var mobilePhone = template.find("#inputDescriptionCourse").value;
    var location = template.find("#inputDescriptionCourse").value;

    modifier = {  firstName: last_name,
                  lastName: last_name,
                  maxParticipants: maxParticipants,
                  public: public }
    Courses.update(this._id, { $set: modifier });

    Router.go("userProfile.show", {_id: this._id} );
  },
  'click #discardChangesUserProfile': function (event, template) {
    Router.go("userProfile.show", {_id: this._id} );
  }
});