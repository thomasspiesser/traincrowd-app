Template.editContactModal.helpers({
	email: function () {
    return Meteor.user().emails[0].address;
  }
});