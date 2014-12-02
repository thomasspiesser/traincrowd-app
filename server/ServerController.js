Meteor.startup(function () {
  // bootstrap the admin user if they exist -- You'll be replacing the id later
  if (Meteor.users.findOne("YczQPZnjzD56mvyKZ"))
      Roles.addUsersToRoles("YczQPZnjzD56mvyKZ", ['admin']);
});


Meteor.methods({
	createInquired: function (options) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    Inquired.insert({
      owner: options.courseOwner,
      course: options.courseId,
      inquirer: this.userId,
      inquiredDates: options.dates,
      createdAt: new Date()
    });
    // TODO: send email to owner
  },
  confirmInquired: function (options) {
    // TODO: check that user._id = course.owner
    // date confirmed so insert into current
    Current.insert({
    	owner: options.courseOwner,
      course: options.courseId,
      courseInstance: options.instanceId,
      participants: [options.inquirer],
      courseDate: options.confirmedDate
    });
    
    //remove from Inquired:
    Inquired.remove({_id: options.instanceId});

    //create pinboard for this course instance
    Pinboards.insert({
      owner: options.courseOwner,
      course: options.courseId,
      courseInstance: options.instanceId,
      name: options.confirmedDate,
      messages: []
    });
  },
  currentCourseDone: function (options) {
  	// course happend so insert into elapsed
  	var current = Current.findOne({_id: options.instanceId});

    Elapsed.insert({
    	owner: current.courseOwner,
      course: current.courseId,
      courseInstance: current.instanceId,
      participants: current.participants,
      courseDate: current.confirmedDate
    });

  	//remove from Current:
    Current.remove({_id: options.instanceId});
  }
})