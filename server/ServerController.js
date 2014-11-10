Meteor.startup(function () {
  // bootstrap the admin user if they exist -- You'll be replacing the id later
  if (Meteor.users.findOne("YczQPZnjzD56mvyKZ"))
      Roles.addUsersToRoles("YczQPZnjzD56mvyKZ", ['admin']);
});