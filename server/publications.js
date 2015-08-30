// TODO: specify return fields

Meteor.publish('courses', function () {
	// Meteor._sleepForMs(5000);
	return Courses.find( { $or: [ { isPublic: true }, { owner: this.userId } ] } );
});

Meteor.publish('singleCourse', function ( slug ) {
	check( slug, String );
	return Courses.find( { slug: slug } );
});

Meteor.publish('singleCourseById', function ( id ) {
	check( id, String );
	return Courses.find( { _id: id } );
});

Meteor.publish('topCourses', function () {
	// Meteor._sleepForMs(5000);
	// return Courses.find( { isPublic: true }, { limit: 6 } );
	return Courses.find( { 'title': { $in: ['Ihr wirksamer Live-Auftritt', 'Tipps und Tricks für EU Fundraising', 'Bilanzen lesen, BWAs verstehen - Rechnungswesen für Entscheider.', 'Living & Working in Germany – German cultural standards in business', 'Social Media Marketing und Strategie Entwicklung', 'Navigation ohne Karte: Strategie Arbeit in der Organisationsentwicklung'] } } );
});

Meteor.publish('bookings', function ( id ) {
	check( id, String );
	return Bookings.find( { _id: id } );
});

Meteor.publish('current', function () {
	return Current.find();
});

Meteor.publish('elapsed', function () {
	return Elapsed.find();
});

Meteor.publish('userData', function () {
	if (! this.userId ) {
		this.ready();
	}
	return Meteor.users.find( { _id: this.userId }, { fields: { services: 0 } } );
});

// TDOD: don't publish all the info from profile..make more specific here
Meteor.publish('trainer', function () {
  return Meteor.users.find( { roles: 'trainer', isPublic: true }, 
  	{ fields: 
  		{ 
  			services: 0, 
  			createdAt: 0, 
  			updatedAt: 0, 
  			emails: 0, 
  			hasPublishRequest: 0, 
  			'profile.billingAddresses': 0, 
  			'profile.selectedBillingAddress': 0, 
  			'profile.taxNumber': 0, 
  			'profile.employer': 0, 
  			'profile.position': 0, 
  			'profile.industry': 0, 
  			'profile.workExperience': 0, 
  			'profile.newsletter': 0, 
  			'profile.phone': 0, 
  			'profile.mobile': 0 
  		} 
  	} 
  );
});

Meteor.publish('topTrainer', function () {
	// Meteor._sleepForMs(5000);
  // return Meteor.users.find( { roles: 'trainer', isPublic: true }, { limit: 4, fields: { 'profile.name': 1, 'profile.imageId': 1 } } );
  return Meteor.users.find( { 'profile.name': { $in: ['Der Hauptstadtcoach', 'Karin Seven', 'Tina Gadow', 'Hartmann Rhetorik GmbH'] } }, { fields: { 'profile.name': 1, 'profile.imageId': 1 } } );
});

// Meteor.publish('singleTrainer', function (id) {
// 	check(id, String);
//   return Meteor.users.find({_id: id, roles: 'trainer'}, {fields: {services:0, createdAt: 0}});
// });

Meteor.publish('categories', function () {
	return Categories.find();
});