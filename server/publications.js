Meteor.publish('courses', function () {
	return Courses.find();
});

Meteor.publish('inquired', function () {
	return Inquired.find();
});

Meteor.publish('current', function () {
	return Current.find();
});

Meteor.publish('elapsed', function () {
	return Elapsed.find();
});

Meteor.publish('userData', function () {
	return Meteor.users.find();
});