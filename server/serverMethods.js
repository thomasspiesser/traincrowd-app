Meteor.methods({
	createInquired: function (options) {
    if (! this.userId)
      throw new Meteor.Error(403, "Du musst eingelogged sein!");
    var id = Inquired.insert({
      owner: options.owner,
      course: options.course,
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
      course: options.course,
    	owner: options.owner,
      participants: [options.inquirer],
      courseDate: options.confirmedDate
    });
    
    //remove from Inquired:
    Inquired.remove({_id: options.id});

  },
  createCurrent: function (options) {

    var id = Current.insert({
      course: options.course,
      owner: options.owner,
      participants: [],
      courseDate: options.courseDate
    });


  },
  deleteCurrent: function (id) {
    Current.remove({_id: id});
  }, 
  updateRoles: function () {
    if (! this.userId)
      throw new Meteor.Error(403, "Du musst eingelogged sein!");
    Roles.setUserRoles(this.userId, 'trainer')
  },
  sendEmail: function (to, subject, text) {
    check([to, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: 'info@traincrowd.de',
      subject: subject,
      text: text
    });
  }
})

//// custom admin methods

Houston.add_collection(Meteor.users);
Houston.add_collection(Houston._admins);
Houston.add_collection(Courses);
Houston.add_collection(Inquired);
Houston.add_collection(Current);
Houston.add_collection(Elapsed);
Houston.add_collection(Images);
Houston.add_collection(Categories);

Houston.methods(Courses, {
  Publish: function (course) {
    Courses.update(course._id, {$set: {public: true}});
    return "Der Kurs: '"+ course.title + "' ist jetzt online!";
  },
  Unpublish: function (course) {
  	Courses.update(course._id, {$set: {public: false}});
    return "Ok, der Kurs: '"+ course.title + "' ist offline.";
  }
});