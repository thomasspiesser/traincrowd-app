Meteor.publish('courses', function () {
	return Courses.find();
});

Meteor.publish('pinboards', function () {
	return Pinboards.find();
});

Meteor.publish('userData', function () {
	return Meteor.users.find();
});