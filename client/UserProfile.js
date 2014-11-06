Template.userProfile.events({
  'click #editUserProfileButton': function () {
    Router.go("userProfile.edit", {_id: this._id} );
  }
});

//////////// editUserProfile template /////////

Template.editUserProfile.events({ 
  'click #saveChangesUserProfile': function (event, template) {
    var skills = template.find('#skills').value
    if (skills.length > 1) {
      var skillsArray = skills.split(",");
    }

    var profile = {
      name: template.find('#name').value,
      about: template.find('#about').value,
      skills: skillsArray,
      description: template.find('#description').value,
      phone: template.find('#phone').value,
      mobile: template.find('#mobile').value,
      location: template.find('#location').value
    },
    user = {
      profile: profile
    }

    Meteor.call('updateUser', user, function(err){
      if(err) {
        console.log(err);
      } else {
        Notifications.info('Profile updated!', 'Successfully saved.', {timeout: 5000});
      }
    });

    Router.go("userProfile.show", {_id: this._id} );
    return false
  },
  'click #discardChangesUserProfile': function (event, template) {
    Router.go("userProfile.show", {_id: this._id} );
  }
});