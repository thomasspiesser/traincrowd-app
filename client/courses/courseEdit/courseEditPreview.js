Template.editCoursePreview.events({
  'click #requestPublicCourseButton': function () {
    if (confirm( "Möchten Sie Ihren Kurs jetzt freischalten lassen? Drücken Sie ok und wir prüfen Ihre Angaben. Wir lassen Sie wissen, sobald wir Ihren Kurs freigeschaltet haben." ) ) {
      if (!this.title || !this.description || !this.categories || !this.aims || !this.maxParticipants || !this.fee) {
        toastr.error( "Einige Angaben fehlen. Bitte überprüfen Sie noch einmal, ob Sie alle Pflichtfelder zu Ihrem Kurs ausgefüllt haben." );
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