Template.becomeTrainerLanding.events({
	'click #startCourseButton': function (event, template) {
    // if (Meteor.userId()) {
      Meteor.call('updateRoles', function (error, results) {
        if (error)
          toastr.error( error.reason );
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
          toastr.error( error.reason );
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
      		toastr.error( error.reason );
      	} else {
      		toastr.success('Wir bitten nun noch um ein paar zusätzliche Infos.' );
      		Router.go("course.edit", {_id: id} );
      	}
      });  
    } else {
      toastr.error( "Bitte gib deinem Kurs einen Titel!" );
    }
    return false
  }
});