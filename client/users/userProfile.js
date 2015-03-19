Template.userProfile.rendered = function () {
  $('.rateit').rateit();
};

Template.userProfile.helpers({
  canEdit: function () {
    return this._id === Meteor.userId();
  },
  isTrainerProfile: function () {
    return Roles.userIsInRole(this._id, 'trainer');
  },
  hostedCourses: function () {
    return Courses.find( { owner: this._id, public: true }, {fields: {imageId:1, title:1, rating:1, slug:1}} );
  }
});

Template.userProfile.events({
  'click #editUserProfileButton': function () {
    Router.go("userProfile.edit", {_id: this._id} );
  }
});

