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
    var commision = +( Session.get("courseFee") / 100 * 15 ).toFixed(2);
    var fee = parseFloat(Session.get("courseFee"));
    return ( ( fee + commision ) / Session.get("courseMaxParticipants") ).toFixed(2);
  },
  serviceFee: function () {
    if (Session.equals("courseMaxParticipants", false) )
      return;
    return ( Session.get("courseFee") / 100 * 15 ).toFixed(2);
  },
  hoverText: function () {
    return courseEditHoverText[ Session.get('showHoverText') ];
  }
});

Template.editCourseCosts.events({
  'click #saveEditCourseCosts': function (event, template) {
    var fee = template.find("#editCourseFee").value;
    // var minParticipants = template.find("#editCourseMinParticipants").value;
    var maxParticipants = template.find("#editCourseMaxParticipants").value;

    if (! fee.length ) {
      $('#editCourseFee').parent().parent().addClass('has-error');
      $('#editCourseFee').parent().next('span').text('Bitte geben Sie hier den Kurspreis an.');
      toastr.error( "Der Kurs benötigt einen Preis." );
      return false;
    }

    if (! maxParticipants.length ) {
      $('#editCourseMaxParticipants').parent().addClass('has-error');
      $('#editCourseMaxParticipants').next('span').text('Bitte geben Sie hier an, wie viele Teilnehmer der Kurs haben sollte.');
      toastr.error( "Dem Kurs fehlt noch eine Teilnehmerzahl." );
      return false;
    }

    // var minParticipants = parseInt(minParticipants);
    maxParticipants = parseInt(maxParticipants);
    // if (minParticipants > maxParticipants) {
    //   toastr.error( "Die maximale Gruppengröße muss mindestens "+minParticipants+" sein." );
    //   return false
    // }

    fee = parseFloat(fee.replace(',','.'));
    fee = +fee.toFixed(2); // rounded to 2 digits returns number coz of +
    var modifier = {_id: this._id,
                owner: this.owner,
                // minParticipants: minParticipants,
                maxParticipants: maxParticipants,
                fee: fee };
    Meteor.call('updateCourse', modifier, function (error, result) {
      if (error)
        toastr.error( error.reason );
      else
        toastr.success( 'Änderungen gespeichert.' );
    });

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
  'input #editCourseFee': function (event, template) {
    Session.set("courseFee", event.currentTarget.value);
  },
  'input #editCourseMaxParticipants': function (event, template) {
    Session.set("courseMaxParticipants", event.currentTarget.value);
  }
});