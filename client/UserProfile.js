Template.userProfile.helpers({
  canEdit: function () {
    return this.user._id === Meteor.userId();
  }, 
  show: function () {
    console.log(this)
  }
});

Template.userCourses.helpers({ 
  showDateOrNoOfParticipants: function (course, helperId) {
    var bookedCourse = _.find(course.current, function (item) { 
      return _.contains(item.participants, Meteor.userId() )
    });
    if (helperId === 1) {
      return bookedCourse.courseDate;
    } else if (helperId === 2) {
      return bookedCourse.participants.length;
    }
  }
});

Template.userProfile.events({
  'click #editUserProfileButton': function () {
    Router.go("userProfile.edit", {_id: this.user._id} );
  }
});

//////////// editUserProfile template /////////

Template.editUserProfile.events({ 
  'click #saveChangesUserProfile': function (event, template) {
    var skills = template.find('#skills').value
    if (skills.length > 1) {
      var skillsArray = skills.split(",");
    }

    var file = template.find('#profilePicture').files[0];
    var reader = new FileReader();

    var profile = {
      profilePicture: '',
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
    
    reader.onload = function(event) {
      user.profile.profilePicture = event.target.result;
      Meteor.call('updateUser', user, function(err){
        if(err) {
          Notifications.error('Snap!', err, {timeout: 5000});
          console.log(err);
        } else {
          Notifications.info('Profile updated!', 'Successfully saved.', {timeout: 5000});
        }
      });
    };
    reader.readAsDataURL(file);

    Router.go("userProfile.show", {_id: this._id} );
    return false
  },
  'click #discardChangesUserProfile': function (event, template) {
    Router.go("userProfile.show", {_id: this._id} );
  }
});