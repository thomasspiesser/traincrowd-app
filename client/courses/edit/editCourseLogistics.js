Template.editCourseLogistics.helpers({
  noLocation: function () {
    if (typeof this.noLocation !== 'undefined')
      Session.setDefault("noLocation", this.noLocation);
    else
      Session.setDefault("noLocation", false);
    return Session.get("noLocation");
  }
});

Template.editCourseLogistics.events({
  'click #saveEditCourseLogistics': function (event, template) {
    if (! this.noLocation && ! this.street && ! this.streetNumber && ! this.plz && ! this.city) {
      $('.form-group').addClass('has-error');
      $('#help-text-edit-course-noLocation').text('Bitte geben Sie an, ob Sie bereits einen Veranstaltungsort haben.').fadeIn(300);
      toastr.error( "Bitte machen Sie Angaben zum Veranstaltungsort." );
      return false;
    }

    Session.set('editCourseTemplate', "editCoursePreview");

    $('#editCourseLogistics').parent().removeClass('active');
    $('#editCoursePreview').parent().addClass('active');  

    return false;
  },
  'change #edit-course-noLocation': function (event) {
    Session.set("noLocation", event.target.checked);
    $('.form-group').removeClass('has-error');
    $('#help-text-edit-course-noLocation').text('speichern...').fadeIn(300);
    lazysaveCourseField( { id: this._id, argName: 'noLocation', argValue: event.target.checked } );
  }
});