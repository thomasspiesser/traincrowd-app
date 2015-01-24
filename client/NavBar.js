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
      Notifications.error('Fehler!', "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben.", {timeout: 8000});
      return false;
    }

		Meteor.call('sendEmail', 
			email, 
			'Traincrowd beta sagt Hallo!',
			'Das ist eine Test-Email.', function (error, result) {
			if (error)
				Notifications.error('Fehler!', error.reason, {timeout: 8000});
			else {
				Notifications.success('Super!', 'Email versandt. Bitte schau in Dein Postfach.', {timeout: 8000});
				$('#testMail').val("");
			}

		});
	}
});

