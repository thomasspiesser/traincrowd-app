Template.becomeTrainerLanding.events({
	'click #startCourseButton': function (event, template) {
		Router.go('becomeTrainer');
	}
});

Template.becomeTrainer.events({
	'click #createCourseButton': function (event, template) {
		event.preventDefault();
    var title = template.find("#inputTitleCourse").value;

    if (title.length) {
      Meteor.call('createCourseNew', title, function (error, id) {
      	if (error) {
      		Notifications.error('Fehler!', error, {timeout: 8000});
      	} else {
      		Notifications.info('Kurs erstellt!', 'Bitte noch ein paar zusätzliche Infos.', {timeout: 8000});
      		Router.go("course.edit", {_id: id} );
      	}
      });  
    } else {
      Notifications.error('Fehler!', "Bitte gib deinem Kurs einen Titel!", {timeout: 8000});
    }
    return false
  }
});