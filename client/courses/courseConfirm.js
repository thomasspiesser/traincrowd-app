Template.courseConfirm.helpers({
  formatedDates: function () {
    var courseDate = this.current.courseDate;
    var formatedDates = _.map(courseDate, function(date){
      return moment(date).format("DD.MM.YYYY");
    });
    return formatedDates;
  }
});

Template.courseConfirmForm.helpers({
  email: function (userId) {
  	var user = Meteor.users.findOne( userId );
    return displayEmail(user);
  }
});

Template.courseConfirmForm.events({
	'click #saveConfirmCourse': function (event, template) {
		var email = template.find("#confirmCourseEmailResponsible").value;
		var name = template.find("#confirmCourseNameResponsible").value;
    var street = template.find("#confirmCourseStreet").value;
    var streetAdditional = template.find("#confirmCourseStreetAdditional").value;
    var plz = template.find("#confirmCoursePLZ").value;
    // var city = template.find("#confirmCourseCity").value;
    var personalMessage = template.find("#confirmCoursePersonalMessage").value;

		if (! EMAIL_REGEX.test(email)) {
      toastr.error( "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben." );
      return false;
    } 

    if (! street.length || plz.length < 5 || ! name.length ) {
      toastr.error( "Bitte geben Sie ein vollständige Adresse und einen Namen für die Ansprechperson an." );
      return false;
    }
    var currentId = this.current._id,
        course = this.course._id;

    Meteor.call('confirmCurrent', Session.get('token'), function (error) {
      if (error) {
        toastr.error( error.reason );
        return false;
      }
      else {
      	toastr.success( "Event bestätigt." );
      	Session.set('token', "");
      	var options = {
      		currentId: currentId,
      		course: course,
      		trainerEmail: email,
      		trainerName: name,
      		street: street,
      		streetAdditional: streetAdditional,
      		plz: plz,
      		personalMessage: personalMessage
      	};
      	Meteor.call('sendCourseFullParticipantsEmail', options, function (error) {
		      if (error)
		        toastr.error( error.reason );
		      else {
		        Router.go('home');
		      }
		    });
      }
    });
	}
});
