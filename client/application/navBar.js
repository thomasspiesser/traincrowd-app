Template.navItemsRight.events({
	'click #logout': function () {
		Meteor.logout( function (error) {
			if ( error )
				toastr.error( error.reason );
			else
				Router.go('home');
		});
	}
});