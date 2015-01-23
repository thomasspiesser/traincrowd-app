Template.becomeTrainerLanding.events({
	'click #startCourseButton': function (event, template) {
    // if (Meteor.userId()) {
      Meteor.call('updateRoles', function (error, results) {
        if (error)
          Notifications.error('Fehler', error, {timeout:8000});
        else 
		      Router.go('createCourse');
      });
    // }
    // else 
      // $('#loginModal').modal('show');
	},
  'click #startProfileButton': function (event, template) {
    // if (Meteor.userId()) {
      Meteor.call('updateRoles', function (error, results) {
        if (error)
          Notifications.error('Fehler', error, {timeout:8000});
        else 
          Router.go('userProfile.edit', {_id: Meteor.userId()});
      });
    // }
    // else 
      // $('#loginModal').modal('show');
  }
});

Template.createCourse.events({
	'click #createCourseButton': function (event, template) {
		event.preventDefault();
    var title = template.find("#inputTitleCourse").value;

    if (title.length) {
      Meteor.call('createCourse', title, function (error, id) {
      	if (error) {
      		Notifications.error('Fehler!', error, {timeout: 8000});
      	} else {
      		Notifications.info('Kurs erstellt!', 'Wir bitten noch um ein paar zusätzliche Infos.', {timeout: 8000});
      		Router.go("course.edit", {_id: id} );
      	}
      });  
    } else {
      Notifications.error('Fehler!', "Bitte gib deinem Kurs einen Titel!", {timeout: 8000});
    }
    return false
  }
});