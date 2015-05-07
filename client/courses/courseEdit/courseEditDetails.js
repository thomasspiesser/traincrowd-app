Template.editCourseDetails.helpers({
  hoverText: function () {
    return courseEditHoverText[ Session.get('showHoverText') ];
  }
});

Template.editCourseDetails.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-course-'+field).parent().removeClass('has-error');
    $('#help-text-edit-course-'+field).text('speichern...').fadeIn(300);
    lazysaveCourseField( { id: this._id, argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditCourseDetails': function (event, template) {
    if (! this.aims || ! this.aims.length ) {
      formFeedbackError( '#edit-course-aims', '#help-text-edit-course-aims', 'Bitte geben Sie Lernziele für Ihren Kurs an.', "Der Kurs benötigt Lernziele." );
      return false;
    }

    Session.set('editCourseTemplate', "editCourseCosts");

    $('#editCourseDetails').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editCourseCosts').children('.progress-tracker').removeClass('inactive').addClass('active');
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
});