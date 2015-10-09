Template.editTrainerPreview.events({
  'click #requestPublicProfileButton': function () {
    if (confirm( "Möchten Sie Ihr Profil jetzt freischalten lassen? Drücken Sie ok und wir prüfen Ihre Angaben. Wir lassen Sie wissen, sobald Ihr Profil freigeschaltet ist." ) ) {
      var user = Meteor.users.findOne({_id: this._id}, {fields: { _id: 0, updatedAt:0 } } );
      var isValid = userSchema.namedContext().validate(user);
      if (!isValid) {
        var invalidKeys = userSchema.namedContext().invalidKeys();
        for (i=0; i<invalidKeys.length; i++) {
          var errTitle = invalidKeys[i].name,
              errMsg = userSchema.namedContext().keyErrorMessage( errTitle );
          toastr.error( errMsg );
        }
        return false;
      }
      Meteor.call( 'setProfilePublishRequest', function ( error, result ) {
        if ( error ) 
          toastr.error( error.reason );
        else
          toastr.success( 'Danke, wir prüfen Ihr Profil und schalten es frei.' );
      });
    }
  },
  'click #unpublishProfileButton': function () {
    if (confirm( "Möchten Sie wirklich, dass Ihr Profil und alle Ihre Kurse nicht mehr öffentlich sind? Drücken Sie ok und Ihr Profil und alle Ihre Kurse sind nicht länger öffentlich auf traincrowd zu finden." ) ) {
      Meteor.call( 'unpublishProfile', function ( error, result ) {
        if ( error ) 
          toastr.error( error.reason );
        else
          toastr.success( 'Ihr Profil und alle Ihre Kurse sind jetzt nicht mehr öffentlich.' );
      });
    }
  }
});