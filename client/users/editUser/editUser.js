Template.editUser.created = function () {
  Session.set("editUserTemplate", "editUserProfile");
};

Template.editUser.helpers({
  // deservesCheckCourseDescription: function () {
  //   return this.title && this.description && this.categories.length ? true : false;
  // },
  // deservesCheckCourseDetails: function () {
  //   return this.aims ? true : false;
  // },
  // deservesCheckCourseCosts: function () {
  //   return this.maxParticipants && this.fee ? true : false;
  // },

  active: function() {
    return Session.get('editUserTemplate');
  }
});

Template.editUser.events({ 
  'click .dynamic-template-selector': function (event) {
    Session.set('editUserTemplate', event.currentTarget.id);

    $('.progress-tracker').removeClass('active').addClass('inactive');
    $(event.currentTarget).children('.progress-tracker').removeClass('inactive').addClass('active');
  }
});