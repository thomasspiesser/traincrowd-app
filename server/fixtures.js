// Meteor.startup(function () {
// 	Courses.find( {slug: {$exists: false}}, {fields: {_id:1, title:1}} ).forEach( function (course) {
// 		var slug = slugify(course.title);
// 		Courses.update( { _id: course._id }, {$set: {slug: slug}} );
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