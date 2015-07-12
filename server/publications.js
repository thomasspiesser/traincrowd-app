// TODO: specify return fields

Meteor.publish('courses', function () {
	return Courses.find({ $or: [ {isPublic: true}, {owner: this.userId} ] });
	// return Courses.find({ isPublic: true });
});

Meteor.publish('singleCourse', function (slug) {
	check(slug, String);
	return Courses.find({slug: slug});
});

Meteor.publish('topCourses', function () {
	return Courses.find( { public: true }, { limit: 6 } );
});

// Meteor.publish('ownCourses', function () {
// 	return Courses.find({ owner: this.userId });
// });

Meteor.publish('bookings', function (_id) {
	check( _id, String);
	return Bookings.find( {_id: _id} );
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
	return Meteor.users.find( { _id: this.userId }, { fields: {services:0 } } );
});

// TDOD: don't publish all the info from profile..make more specific here
Meteor.publish('trainer', function () {
  return Meteor.users.find( { roles: 'trainer', isPublic: true }, { fields: { services:0, createdAt: 0 } } );
});

Meteor.publish('topTrainer', function () {
  return Meteor.users.find( { roles: 'trainer', public: true }, { limit: 4, fields: { services:0, createdAt: 0 } } );
});

// Meteor.publish('singleTrainer', function (id) {
// 	check(id, String);
//   return Meteor.users.find({_id: id, roles: 'trainer'}, {fields: {services:0, createdAt: 0}});
// });

Meteor.publish('categories', function () {
	return Categories.find();
});