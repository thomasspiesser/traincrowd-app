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
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-course-'+field).parent().removeClass('has-error');
    $('#help-text-edit-course-'+field).text('speichern...').fadeIn(300);
    lazysaveCourseField( { id: this._id, argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditCourseLogistics': function (event, template) {

    if (! this.noLocation && ! this.street && ! this.streetNumber && ! this.plz && ! this.city) {
      $('.form-group').addClass('has-error');
      $('#help-text-edit-course-noLocation').text('Bitte geben Sie an, ob Sie bereits einen Veranstaltungsort haben.');
      toastr.error( "Bitte machen Sie Angaben zum Veranstaltungsort." );
      return false;
    }

    Session.set('editCourseTemplate', "editCoursePreview");

    $('#editCourseLogistics').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editCoursePreview').children('.progress-tracker').removeClass('inactive').addClass('active');    
  },
  'change #edit-course-noLocation': function (event) {
    Session.set("noLocation", event.target.checked);
    $('#edit-course-noLocation').parent().removeClass('has-error');
    $('#help-text-edit-course-noLocation').text('speichern...').fadeIn(300);
    lazysaveCourseField( { id: this._id, argName: 'noLocation', argValue: event.target.checked } );
  }
});