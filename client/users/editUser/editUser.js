Template.editUser.created = function () {
  Session.set("editUserTemplate", "editUserProfile");
};

Template.editUser.helpers({
  deservesCheckUserProfile: function () {
    return this.profile.title && this.profile.name && this.profile.employer && this.profile.position && this.profile.industry && this.profile.workExperience ? true : false;
  },
  deservesCheckUserAddress: function () {
    return this.profile.phone && this.profile.mobile && this.profile.billingAddresses[0].street && this.profile.billingAddresses[0].streetNumber && this.profile.billingAddresses[0].plz && this.profile.billingAddresses[0].city ? true : false;
  },
  deservesCheckUserAccount: function () {
    return this.emails[0].address ? true : false;
  },
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