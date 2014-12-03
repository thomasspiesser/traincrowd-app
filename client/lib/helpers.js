//////////// global helper functions /////////

// var varible -> file scope
// varible -> project scope

trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

// works only where data context is Course
UI.registerHelper('canEdit', function(owner) {
  return owner === Meteor.userId();
});

UI.registerHelper('error', function() {
  return Session.get("createError");
});

// works only where data context is Course
UI.registerHelper('ownerName', function(userId) {
	var user = Meteor.users.findOne( userId )
	if (user.profile && user.profile.name) 
  	return user.profile.name;
  else return user.emails[0].address;

});