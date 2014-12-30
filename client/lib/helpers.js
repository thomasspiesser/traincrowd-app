//////////// global helper functions /////////

// var varible -> file scope
// varible -> project scope

trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

UI.registerHelper('fakeParagraph', function (number) {
    return Fake.paragraph(number);
});

UI.registerHelper('canEdit', function(owner) {
  return owner === Meteor.userId();
});

UI.registerHelper('error', function() {
  return Session.get("createError");
});

UI.registerHelper('ownerName', function(userId) {
	var user = Meteor.users.findOne( userId )
	return displayName(user);
});

displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};