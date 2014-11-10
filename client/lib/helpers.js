//////////// global helper functions /////////

// var varible -> file scope
// varible -> project scope

trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

// works only where data context is Course
UI.registerHelper('canEdit', function() {
  return this.owner === Meteor.userId();
});

UI.registerHelper('error', function() {
  return Session.get("createError");
});

// works only where data context is Course
UI.registerHelper('ownerName', function() {
  if (this.owner) {
    return Meteor.users.findOne( this.owner ).profile.name;
  }
});