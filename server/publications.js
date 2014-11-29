Meteor.publish('courses', function () {
	return Courses.find();
});

Meteor.publish('pinboards', function () {
	return Pinboards.find();
});