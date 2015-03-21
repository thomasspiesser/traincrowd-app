Template.trainerProfile.rendered = function () {
  $('.rateit').rateit();
};

Template.trainerProfile.helpers({
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

Template.trainerProfile.events({
  'click #editUserProfileButton': function () {
    Router.go("trainerProfile.edit", {_id: this._id} );
  }
});

