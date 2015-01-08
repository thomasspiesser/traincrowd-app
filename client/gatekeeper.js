Template.gatekeeper.events({
	'click #unlockWithKey': function (event, template) {
		var key = template.find('#gatekey').value;
		check(key, String);
    if (key === 'supersecretpassword') {
      Session.set("gatekey", true);
      Router.go('/')
    } 
    else {
      Notifications.error('Fehler!', "Anscheinend kennen wir uns nicht!", {timeout: 8000});
    }
	}
});