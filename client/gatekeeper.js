Template.gatekeeper.events({
	'click #unlockWithKey': function (event, template) {
		var key = template.find('#gatekey').value;
		check(key, String);
    if (key === 'supersecretpassword') {
      Session.setPersistent("gatekey", true);
      Router.go('/')
    } 
    else {
      toastr.error( "Anscheinend kennen wir uns nicht!" );
    }
	}
});