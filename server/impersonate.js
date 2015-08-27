Meteor.methods({
  impersonate: function( userId ) {
    check( userId, String );

    if ( ! Meteor.users.findOne( {_id: userId } ) )
      throw new Meteor.Error(404, 'User not found');

    if ( ! Roles.userIsInRole( this.userId, ["admin"] ) )
      throw new Meteor.Error(403, 'Permission denied. Must be an admin for this action.');

    this.setUserId( userId );
  }
});