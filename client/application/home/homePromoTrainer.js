Template.homePromoTrainer.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe("topTrainer");
});

Template.homePromoTrainer.helpers({
	topTrainer: function () {
    // return Meteor.users.find( { roles: 'trainer', isPublic: true }, { limit: 4 } );
    return Meteor.users.find( { 'profile.name': { $in: ['launchlabs', 'Miriam Janke', 'Christian Sauter', 'Wiebke Witt'] } } );
  },
});