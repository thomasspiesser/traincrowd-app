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