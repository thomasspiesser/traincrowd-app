Template.editCourseDetails.helpers({
  hoverText: function () {
    return courseEditHoverText[ Session.get('showHoverText') ];
  }
});

Template.editCourseDetails.events({
  'click #saveEditCourseDetails': function (event, template) {
    var aims = template.find("#editCourseAims").value;
    var methods = template.find("#editCourseMethods").value;
    var targetGroup = template.find("#editCourseTargetGroup").value;
    var prerequisites = template.find("#editCoursePrerequisites").value;
    var languages = template.find("#editCourseLanguages").value;
    var additionalServices = template.find("#editCourseAdditionalServices").value;

    if (! aims.length ) {
      $('#editCourseAims').parent().addClass('has-error');
      $('#editCourseAims').next('span').text('Bitte geben Sie Lernziele für Ihren Kurs an.');
      toastr.error( "Der Kurs benötigt Lernziele." );
      return false;
    }

    var modifier = {_id: this._id,
                owner: this.owner,
                aims: aims,
                methods: methods,
                targetGroup: targetGroup,
                prerequisites: prerequisites,
                languages: languages,
                additionalServices: additionalServices };

    Meteor.call('updateCourse', modifier, function (error, result) {
      if (error)
        toastr.error( error.reason );
      else
        toastr.success( 'Änderungen gespeichert.' );
    });

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