Template.editTrainer.created = function () {
  Session.set("editTrainerTemplate", "editTrainerProfileN");
};

Template.editTrainer.helpers({
  deservesCheckTrainerProfile: function () {
    return this.profile.title && this.profile.name && this.profile.description && this.profile.languages && this.profile.certificates ? true : false;
  },
  deservesCheckTrainerAddress: function () {
    return this.profile.phone && this.profile.mobile && this.profile.street && this.profile.streetNumber && this.profile.plz && this.profile.city ? true : false;
  },
  deservesCheckTrainerAccount: function () {
    return this.emails[0].address ? true : false;
  },
  active: function() {
    return Session.get('editTrainerTemplate');
  }
});

Template.editTrainer.events({ 
  'click .dynamic-template-selector': function (event) {
    Session.set('editTrainerTemplate', event.currentTarget.id);

    $('.progress-tracker').removeClass('active').addClass('inactive');
    $(event.currentTarget).children('.progress-tracker').removeClass('inactive').addClass('active');
  }
});