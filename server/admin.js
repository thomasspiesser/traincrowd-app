ServerAdmin.allowed = function( userId ) {
  var user = Meteor.users.findOne( userId );

  return user && Roles.userIsInRole( userId, ["admin"] );
};