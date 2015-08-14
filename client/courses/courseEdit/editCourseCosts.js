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
    var fee = parseInt( Session.get("courseFee") );
    return ( ( fee + commision ) / Session.get("courseMaxParticipants") ).toFixed(0);
  },
  tcCommision: function () {
    if ( Session.equals("courseMaxParticipants", false ) )
      return;
    return calcCommision( Session.get("courseFee") ).toFixed(0);
  },
});

Template.editCourseCosts.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-course-'+field).parent().removeClass('has-error');
    $('#help-text-edit-course-'+field).text('speichern...').fadeIn(300);
    var val = parseInt( event.currentTarget.value );
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

    $('#editCourseCosts').parent().removeClass('active');
    $('#editCourseDates').parent().addClass('active');

    return false;
  },
  'input #edit-course-fee': function (event, template) {
    var val = parseInt( event.currentTarget.value );
    Session.set("courseFee", val );
  },
  'input #edit-course-maxParticipants': function (event, template) {
    var val = parseInt( event.currentTarget.value );
    Session.set("courseMaxParticipants", val );
  }
});

Template.editCourseCosts.events( hoverCheckEvents );