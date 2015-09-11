// Template.trainerProfile.rendered = function () {
//   $('.rateit').rateit();
// };

Template.trainerProfile.helpers({
  shareData: function () {
    var data = {
      title: this.profile.name,
      description: this.profile.description,
      url: Meteor.absoluteUrl() + 'profile/' + this._id
    };
    return data;
  },
  isPublic: function () {
    return this.isPublic;
  },
  canEdit: function () {
    return this._id === Meteor.userId();
  },
  hostedCourses: function () {
    return Courses.find( { owner: this._id, isPublic: true }, {fields: {imageId:1, title:1, rating:1, slug:1}} );
  }
});

Template.trainerProfile.events({
  'click #impersonate': function ( event, tempalte ) {
    var userId = this._id;
    var username = this.profile.name;
    Meteor.call('impersonate', userId, function ( error, result ) {
      if ( error )
        toastr.error( error.reason );
      else {
        toastr.success( 'Impersonating ' +  username );
        Meteor.connection.setUserId( userId );
      }
    });
  },
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  }
});
