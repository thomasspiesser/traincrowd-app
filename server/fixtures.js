Meteor.startup(function () {
	Courses.find( {slug: {$exists: false}}, {fields: {_id:1, title:1}} ).forEach( function (course) {
		var slug = slugify(course.title);
		Courses.update( { _id: course._id }, {$set: {slug: slug}} );
	} );

});