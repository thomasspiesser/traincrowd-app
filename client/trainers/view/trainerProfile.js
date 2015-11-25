// Template.trainerProfile.rendered = function () {
//   $('.rateit').rateit();
// };

Template.trainerProfile.helpers({
  shareData() {
    var data = {
      title: this.profile.name,
      description: this.profile.description,
      url: Meteor.absoluteUrl() + 'profile/' + this.slug,
    };
    return data;
  },
  isPublic() {
    return this.isPublic;
  },
  hostedCourses() {
    return Courses.find( { owner: this._id, isPublic: true }, {
      fields: { imageId: 1, title: 1, rating: 1, slug: 1 },
    });
  },
});

Template.trainerProfile.events({
  'click #impersonate'() {
    var userId = this._id;
    var username = this.profile.name;
    Meteor.call('impersonate', userId, function ( error ) {
      if ( error )
        toastr.error( error.reason );
      else {
        toastr.success( 'Impersonating ' +  username );
        Meteor.connection.setUserId( userId );
      }
    });
  },
  'click .share-open'( event ) {
    $(event.currentTarget).next().toggleClass('in');
  }
});
