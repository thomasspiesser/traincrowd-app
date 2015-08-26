Template.trainerProfile.rendered = function () {
  $('.rateit').rateit();
};

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
  // isTrainerProfile: function () {
  //   return Roles.userIsInRole(this._id, 'trainer');
  // },
  hostedCourses: function () {
    return Courses.find( { owner: this._id, isPublic: true }, {fields: {imageId:1, title:1, rating:1, slug:1}} );
  }
});

Template.trainerProfile.events({
  'click #editTrainerProfileButton': function () {
    Router.go("edit.trainer", {_id: this._id} );
  },
  'click #requestPublicProfileButton': function () {
    if (confirm( "Anfrage zur Freigabe senden?" ) ) {
      if ( ! this._id || ! this.profile.name ) {
        toastr.error( "Sie müssen eingeloggt sein und Ihren Namen angeben." );
        return false;
      }
      var options = {
        what: 'Trainerprofil',
        itemId: this._id,
        itemName: this.profile.name
      };
      Meteor.call( 'sendRequestPublicationEmail', options, function (error, result) {
        if ( error ) 
          toastr.error( error.reason );
        else
          toastr.success( 'Anfrage zur Freigabe gesendet.' );
      });
    }
  },
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  }
});
