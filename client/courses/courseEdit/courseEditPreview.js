Template.editCoursePreview.events({
  'click #requestPublicCourseButton': function () {
    if (confirm( "Anfrage zur Freigabe senden?" ) ) {
      if (!this._id || !this.title) {
        toastr.error( "Sie müssen eingeloggt sein und einen Kurstitel angeben." );
        return false;
      }
      var options = {
        what: 'Kurs',
        itemId: this._id,
        itemName: this.title
      };
      Meteor.call('setPublishRequest', options, function (error) {
        if (error) 
          toastr.error( error.reason );
        else
          toastr.success( 'Anfrage zur Freigabe gesendet.' );
      });
    }
  }
});