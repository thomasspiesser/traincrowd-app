//////////// editCourse template /////////

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
  'click #cancelEditCourseButton': function (event, template) {
    Router.go("course.show", {_id: this._id} );
  }
});