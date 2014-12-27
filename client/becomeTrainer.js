Template.becomeTrainer.events({
	'click #createCourseButton': function (event, template) {
    var title = template.find("#inputTitleCourse").value;

    if (title.length) {
      var id = createCourse({
        title: title
      });
      Notifications.info('Kurs erstellt!', 'Wir werden den Kurs durchsehen und ihn zeitnah freischalten. Sobald der Kurs online geht werden wir Dich benachrichtigen.', {timeout: 8000});
      Router.go("course.edit", {_id: id} );
    } else {
      Notifications.error('Fehler!', "Bitte gib deinem Kurs einen Titel!", {timeout: 8000});
    }
    return false
  }
});