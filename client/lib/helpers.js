//////////// global helper functions /////////

// var varible -> file scope
// varible -> project scope

trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

UI.registerHelper('show', function () {
  console.log(this);
});

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

UI.registerHelper('image', function(imageId) {
  return Images.findOne({_id: imageId}).data;
});