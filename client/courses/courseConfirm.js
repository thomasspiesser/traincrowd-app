Template.courseConfirm.helpers({
  formatedDates: function () {
    var courseDate = this.current.courseDate;
    var formatedDates = _.map( courseDate, function( date ){
      return moment( date ).format( "DD.MM.YYYY" );
    });
    return formatedDates;
  }
});

Template.courseConfirmForm.helpers({
  email: function (userId) {
  	var user = Meteor.users.findOne( userId );
    return displayEmail( user );
  }
});

Template.courseConfirmForm.events({
	'click #saveConfirmCourse': function (event, template) {
		var email = template.find("#confirmCourseEmailResponsible").value;
		var name = template.find("#confirmCourseNameResponsible").value;
    var begin = template.find("#confirmCourseBegin").value;
    var personalMessage = template.find("#confirmCoursePersonalMessage").value;

		if ( ! EMAIL_REGEX.test( email ) ) {
      toastr.error( "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben." );
      return false;
    } 

    var course = this.course;
    if ( ! course || ! course.street || ! course.streetNumber || ! course.plz || ! course.city ) {
      toastr.error( 'Die Adresse ist unvollständig.' );
      return false;
    }

    if ( ! name.length ) {
      toastr.error( "Bitte geben Sie einen Namen für die Ansprechperson an." );
      return false;
    }

    if ( ! begin.length ) {
      toastr.error( "Bitte geben Sie die Zeit für den Kursbeginn an." );
      return false;
    }

  	var options = {
  		currentId: this.current._id,
  		course: course._id,
  		trainerEmail: email,
  		trainerName: name,
  		begin: begin,
  		personalMessage: personalMessage
  	};
    Meteor.call( 'confirmEvent', Session.get('token'), options, function ( error, result ) {
      if ( error ) {
        toastr.error( error.reason );
        return false;
      }
      else {
        toastr.success( "Event bestätigt." );
        Session.set( 'token', "" );
		    Router.go( 'home' );
      }
    });
	}
});
