Template.homePromoCourses.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe("topCourses");
});

Template.homePromoCourses.helpers({
	topCourses: function () {
    return Courses.find( { public: true }, { limit: 6 } );
  },
});