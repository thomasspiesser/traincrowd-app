Template.navItemsLeft.helpers({
	isMember: function () {
		if (Meteor.userId()) {
			if (Meteor.user().emails[0].address === 'thomas@traincrowd.de')
				return true
		}
	}
});

Template.navItemsRight.events({
	'click #logout': function () {
		Meteor.logout();
	}
});