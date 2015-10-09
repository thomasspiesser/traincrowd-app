Template.createCourse.events({
	'click #createCourseButton': function ( event, template ) {
		event.preventDefault();
    var title = template.find("#inputTitleCourse").value;
    if ( title.length > 120 ) {
      toastr.error( "Der Titel darf nicht mehr als 120 Zeichen haben." );
      return false;
    }

    if ( title.length ) {
      Meteor.call( 'createCourse', title, function ( error, slug ) {
      	if ( error ) {
      		toastr.error( error.reason );
      	}
        else {
      		toastr.success('Wir bitten nun noch um ein paar zusätzliche Infos.' );
      		Router.go("course.edit", { slug: slug } );
      	}
      });  
    }
    else {
      toastr.error( "Bitte geben Sie Ihrem Kurs einen Titel!" );
    }
    return false;
  }
});