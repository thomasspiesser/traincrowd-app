//////////// editCourse template /////////

$.fn.datepicker.dates['de'] = {
    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
    daysShort: ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"],
    daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    today: "Heute",
    clear: "Löschen",
    weekStart: 1,
    format: "dd.mm.yyyy"
  };

Template.editCourseDatesLogistics.rendered=function() {
    $('#editCourseDates').datepicker({
      startDate: "-0d",
      language: "de",
      todayBtn: true,
      multidate: 6,
      todayHighlight: true
    });
}

Template.editCourse.events({ 
  'click #editCourseButton': function (event, template) {
    var title = template.find("#inputTitleCourse").value;
    var description = template.find("#inputDescriptionCourse").value;
    var maxParticipants = parseInt(template.find("#inputMaxNrParticipantsCourse").value);

    if (title.length && description.length && maxParticipants > 1) {
      modifier = {  title: title,
                    description: description,
                    maxParticipants: maxParticipants }
      Courses.update(this._id, { $set: modifier });
      Notifications.info('Kurs erfolgreich geändert!', 'Deine Änderungen wurden übernommen.', {timeout: 5000});
      // Router.go("course.show", {_id: this._id} );
    } else {
      Notifications.error('Fehler!', "Es ist ein Fehler aufgetreten. Dein Kurs wurde nicht aktualisiert. Sind alle Felder ausgefüllt?", {timeout: 5000});
    }
    return false
  },
  'click #removeCourseButton': function (event, template) {
    Courses.remove(this._id);
    Router.go("/courses");
  },
  'click #previewCourseButton': function (event, template) {
    // TODO: publish is false but owner can see the course
    Router.go("course.show", {_id: this._id} );
  }
});

Template.editCourseDescription.events({
  'click #saveEditCourse': function () {
    // get the input data
    // check the non-optional ones for not empty
    // check all for appropriate type
    // provide user feedback if error from one of the above checks
    // make meteor call to update DB securely
    // provide feedback on success/error
  }
});

Template.editCourseCostsServices.events({
  'click #saveEditCourse': function () {
    // ...
  }
});



Template.editCourseDatesLogistics.helpers({
  noLocation: function () {
    return Session.get("noLocation");
  }
});

Template.editCourseDatesLogistics.events({
  'click #saveEditCourseDatesLogistics': function (event, template) {
    var dates = template.find("#editCourseDates").value;
    console.log(dates);
    var allowInquiry = template.find('input:checkbox[id=editCourseAllowInquiry]:checked');
    console.log(allowInquiry);

  },
  'change #editCourseNoLocation': function (event) {
    Session.set("noLocation", event.target.checked);
  }
});