// TODO: specify return fields

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
	if (! this.userId ) {
		this.stop();
	  return;
	}
	return Meteor.users.find({_id: this.userId});
});

Meteor.publish('trainer', function () {
  return Meteor.users.find({roles: 'trainer'});
});

Meteor.publish('images', function () {
	return Images.find();
});