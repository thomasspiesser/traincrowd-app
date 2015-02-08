

Template.navItemsRight.events({
	'click #logout': function () {
		Meteor.logout();
	}, 
	// 'click #sendTestMail, submit .navbar-form': function (event, template) {
	// 	event.preventDefault();
	// 	var email = template.find('#testMail').value;
	// 	if (! EMAIL_REGEX.test(email)) {
 //      toastr.error('Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben.');
 //      return false;
 //    }
 //    var options = {
 //    	to: email
 //    };

	// 	Meteor.call('sendTestEmail', options, function (error, result) {
	// 		if (error)
	// 			toastr.error(error.reason);
	// 		else {
	// 			toastr.success('Email versandt. Bitte schau in Dein Postfach.');
	// 			$('#testMail').val("");
	// 		}

	// 	});
	// }
});

