// TODO: specify return fields

Meteor.publish('courses', function () {
	return Courses.find({ $or: [ {public: true}, {owner: this.userId} ] });
	// return Courses.find({ public: true });
});

Meteor.publish('singleCourse', function (slug) {
	check(slug, String);
	return Courses.find({slug: slug});
});

// Meteor.publish('ownCourses', function () {
// 	return Courses.find({ owner: this.userId });
// });

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
	return Meteor.users.find({_id: this.userId},{fields: {services:0, createdAt: 0}});
});

// TDOD: don't publish all the info from profile..make more specific here
Meteor.publish('trainer', function () {
  return Meteor.users.find({roles: 'trainer'},{fields: {services:0, createdAt: 0}});
});

// Meteor.publish('singleTrainer', function (id) {
// 	check(id, String);
//   return Meteor.users.find({_id: id, roles: 'trainer'}, {fields: {services:0, createdAt: 0}});
// });

Meteor.publish('categories', function () {
	return Categories.find();
});