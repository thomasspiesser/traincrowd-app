Template.editCourseCosts.rendered = function () {
  if (this.data.fee)
    Session.set("courseFee", this.data.fee);
  else
    Session.set("courseFee", 0);
  if (this.data.maxParticipants)
    Session.set("courseMaxParticipants", this.data.maxParticipants);
  else
    Session.set("courseMaxParticipants", false);
};

Template.editCourseCosts.helpers({
  feePP: function () {
    if (Session.equals("courseMaxParticipants", false) )
      return;
    var commision = calcCommision( Session.get("courseFee") );
    var fee = parseFloat( Session.get("courseFee") );
    return ( ( fee + commision ) / Session.get("courseMaxParticipants") ).toFixed(2);
  },
  tcCommision: function () {
    if (Session.equals("courseMaxParticipants", false) )
      return;
    return calcCommision( Session.get("courseFee") ).toFixed(2);
  },
  hoverText: function () {
    return courseEditHoverText[ Session.get('showHoverText') ];
  }
});

Template.editCourseCosts.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-course-'+field).parent().removeClass('has-error');
    $('#help-text-edit-course-'+field).text('speichern...').fadeIn(300);
    var val = parseInt(event.currentTarget.value);
    lazysaveCourseField( { id: this._id, argName: field, argValue: val } );
  },
  'click #saveEditCourseCosts': function (event, template) {
    if (! this.maxParticipants ) {
      formFeedbackError( '#edit-course-maxParticipants', '#help-text-edit-course-maxParticipants', 'Bitte geben Sie hier an, wie viele Teilnehmer der Kurs haben sollte.', "Dem Kurs fehlt noch eine Teilnehmerzahl." );
      return false;
    }

    if (! this.fee ) {
      formFeedbackError( '#edit-course-fee', '#help-text-edit-course-fee', 'Bitte geben Sie hier den Kurspreis an.', "Der Kurs benötigt einen Preis." );
      return false;
    }

    Session.set('editCourseTemplate', "editCourseDates");

    $('#editCourseCosts').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editCourseDates').children('.progress-tracker').removeClass('inactive').addClass('active');
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  },
  'input #edit-course-fee': function (event, template) {
    Session.set("courseFee", event.currentTarget.value);
  },
  'input #edit-course-maxParticipants': function (event, template) {
    Session.set("courseMaxParticipants", event.currentTarget.value);
  }
});