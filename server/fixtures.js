// Meteor.startup(function () {
// 	Courses.find( {createdAt: {$exists: false}}, {fields: {_id:1}} ).forEach( function (course) {
// 		console.log(course);
// 		Courses.update( { _id: course._id }, {$set: {createdAt: new Date()}} );
// 	} );
// });

// Meteor.startup(function () {
// 	Courses.find( {public: {$exists: false}}, {fields: {_id:1}} ).forEach( function (course) {
// 		console.log(course);
// 		Courses.update( { _id: course._id }, {$set: { public: false }} );
// 	} );
// });

// Meteor.startup(function () {
// 	Courses.find( {publishRequest: {$exists: false}}, {fields: {_id:1}} ).forEach( function (course) {
// 		console.log(course);
// 		Courses.update( { _id: course._id }, {$set: { publishRequest: false }} );
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