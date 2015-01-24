Template.navItemsLeft.helpers({
	isMember: function () {
		return true
		if (Meteor.userId()) {
			if (Meteor.user().emails[0].address === 'thomas@traincrowd.de')
				return true
		}
	}
});

Template.navItemsRight.events({
	'click #logout': function () {
		Meteor.logout();
	}, 
	'click #sendTestMail': function (event, template) {
		var email = template.find('#testMail').value;
		if (! EMAIL_REGEX.test(email)) {
      toastr.error('Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben.');
      return false;
    }

		Meteor.call('sendEmail', 
			email, 
			'Traincrowd beta sagt Hallo!',
			'Das ist eine Test-Email.', function (error, result) {
			if (error)
				toastr.error(error.reason);
			else {
				toastr.success('Email versandt. Bitte schau in Dein Postfach.');
				$('#testMail').val("");
			}

		});
	}
});

