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
  if (!Meteor.userId())
    return false;
  return owner === Meteor.userId();
});

UI.registerHelper('error', function() {
  return Session.get("createError");
});

UI.registerHelper('username', function(userId) {
	var user = Meteor.users.findOne( userId )
	return displayName(user);
});

// UI.registerHelper('image', function(imageId) {
//   var image = Images.findOne({_id: imageId})
//   if (image)
//     return image.data;
//   return false
// });