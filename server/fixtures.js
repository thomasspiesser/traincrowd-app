// Meteor.startup(function () {
// 	Meteor.users.find( {public: {$exists: false}}, {fields: {_id:1}} ).forEach( function (user) {
// 		Meteor.users.update( { _id: user._id }, {$set: {public: false }} );
// 	} );
// });

// Meteor.startup(function () {
// 	Meteor.users.find( {"profile.billingAddresses": {$exists: false}}, {fields: {_id:1,profile:1}} ).forEach( function (user) {
// 		console.log(user);
// 		var firm, street, streetNumber, streetAdditional, plz, city;

// 		firm = user.profile && user.profile.firm || undefined;
// 		street = user.profile && user.profile.street || undefined;
// 		streetAdditional = user.profile && user.profile.streetAdditional || undefined;
// 		streetNumber = user.profile && user.profile.streetNumber || undefined;
// 		plz = user.profile && user.profile.plz || undefined;
// 		city = user.profile && user.profile.city || undefined;

// 		var billingAddress = {
// 			firm: firm,
// 			street: street,
// 			streetAdditional: streetAdditional,
// 			streetNumber: streetNumber,
// 			plz: plz,
// 			city: city
// 		};
		
// 		Meteor.users.update( { _id: user._id }, {$set: {"profile.billingAddresses": [ billingAddress ], "profile.selectedBillingAddress": 0 }} );
// 	} );
// });

// Meteor.startup(function () {
// 	Courses.find( {hasDate: {$exists: false}}, {fields: {_id:1}} ).forEach( function (course) {
// 		Courses.update( { _id: course._id }, {$set: { hasDate: false }}, {validate: false} );
// 	} );
// });

// Meteor.startup(function () {
// 	Meteor.users.find( {hasPublishRequest: {$exists: false}}, {fields: {_id:1}} ).forEach( function (user) {
// 		Meteor.users.update( { _id: user._id }, {$set: { hasPublishRequest: false }} );
// 	} );
// });

// Meteor.startup(function () {
// 	Meteor.users.find().forEach( function (user) {

// 		var hasPublishRequest;
// 		if ( typeof user.publishRequest === "boolean" )
// 			hasPublishRequest = user.publishRequest;
// 		if ( typeof user.hasPublishRequest === "boolean" )
// 			hasPublishRequest = user.hasPublishRequest;

// 		var isPublic;
// 		if (typeof user.public === "boolean")
// 			isPublic = user.public;
// 		if (typeof user.isPublic === "boolean")
// 			isPublic = user.isPublic;

// 		Meteor.users.update( {_id: user._id}, { $unset: { "publishRequest": "", "public": ""}, $set: { "hasPublishRequest": hasPublishRequest, "isPublic": isPublic } }, {validate:false} );
// 	} );
// 	Courses.find().forEach( function (course) {

// 		var hasPublishRequest;
// 		if ( typeof course.publishRequest === "boolean" )
// 			hasPublishRequest = course.publishRequest;
// 		if ( typeof course.hasPublishRequest === "boolean" )
// 			hasPublishRequest = course.hasPublishRequest;

// 		var isPublic;
// 		if (typeof course.public === "boolean")
// 			isPublic = course.public;
// 		if (typeof course.isPublic === "boolean")
// 			isPublic = course.isPublic;

// 		Courses.update( { _id: course._id }, { $unset: { "publishRequest": "", "public": ""}, $set: { "hasPublishRequest": hasPublishRequest, "isPublic": isPublic } }, {validate:false} );
// 	} );
// });

// Meteor.startup(function () {
// 	Current.find( {courseTitle: {$exists: false}} ).forEach( function (current) {
// 		var course = Courses.findOne({_id: current.course}, {fields: {owner:1,title:1}});
// 		if (course && course.owner && course.title) {
// 			var user = Meteor.users.findOne( course.owner );
// 			if (user){
//     		var username = displayName(user);
// 				Current.update( { _id: current._id }, {$set: {courseTitle: course.title, ownerName: username}} );
// 			}
// 		}
// 	} );

// });