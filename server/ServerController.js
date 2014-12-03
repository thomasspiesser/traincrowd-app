// Meteor.startup(function () {
//   // bootstrap the admin user if they exist -- You'll be replacing the id later
//   if (Meteor.users.findOne("YczQPZnjzD56mvyKZ"))
//       Roles.addUsersToRoles("YczQPZnjzD56mvyKZ", ['admin']);
// });


Meteor.methods({
	createInquired: function (options) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    var id = Inquired.insert({
      owner: options.courseOwner,
      course: options.courseId,
      inquirer: this.userId,
      inquiredDates: options.dates,
      createdAt: new Date()
    });
    return id;
    // TODO: send email to owner
  },
  confirmInquired: function (options) {
    // TODO: check that user._id = course.owner
    // date confirmed so insert into current
    Current.insert({
      _id: options.id,
      course: options.courseId,
    	owner: options.courseOwner,
      participants: [options.inquirer],
      courseDate: options.confirmedDate
    });
    
    //remove from Inquired:
    Inquired.remove({_id: options.id});

    //create pinboard for this course instance
    Pinboards.insert({
      _id: options.id,
      owner: options.courseOwner,
      course: options.courseId,
      name: options.confirmedDate,
      messages: []
    });
  },
  currentCourseDone: function (options) {
  	// course happend so insert into elapsed
  	var current = Current.findOne({_id: options.id});

    Elapsed.insert({
      _id: current.id,
    	owner: current.courseOwner,
      course: current.courseId,
      participants: current.participants,
      courseDate: current.confirmedDate
    });

  	//remove from Current:
    Current.remove({_id: options.id});
  }
})

//// custom admin methods

Houston.add_collection(Meteor.users);
Houston.add_collection(Houston._admins);
Houston.add_collection(Courses);
Houston.add_collection(Inquired);
Houston.add_collection(Current);
Houston.add_collection(Elapsed);
Houston.add_collection(Pinboards);

Houston.methods(Courses, {
  Publish: function (course) {
    Courses.update(course._id, {$set: {public: true}});
    return course.title + " published successfully.";
  },
  Unpublish: function (course) {
  	Courses.update(course._id, {$set: {public: false}});
    return course.title + " unpublished successfully.";
  }
});