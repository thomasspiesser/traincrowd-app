Template.editCoursePreview.events({
  'click #requestPublicCourseButton': function () {
    if (confirm( "Möchten Sie Ihren Kurs jetzt freischalten lassen? Drücken Sie ok und wir prüfen Ihre Angaben. Wir lassen Sie wissen, sobald wir Ihren Kurs freigeschaltet haben." ) ) {
      // var course = Courses.findOne( { _id: this._id }, { fields: { updatedAt:0 } } );
      // var isValid = courseSchema.namedContext().validate( _.omit( course, '_id') );
      // if (!isValid) {
      //   var invalidKeys = courseSchema.namedContext().invalidKeys();
      //   for (i=0; i<invalidKeys.length; i++) {
      //     var errTitle = invalidKeys[i].name,
      //         errMsg = courseSchema.namedContext().keyErrorMessage( errTitle );
      //     toastr.error( errMsg );
      //   }
      //   return false;
      // }
      var options = {
        what: 'Kurs',
        itemId: this._id,
        itemName: this.title
      };
      Meteor.call('setCoursePublishRequest', options, function (error) {
        if (error) 
          toastr.error( error.reason );
        else
          toastr.success( 'Danke, wir prüfen Ihren Kurs und schalten ihn frei.' );
      });
    }
  }
});