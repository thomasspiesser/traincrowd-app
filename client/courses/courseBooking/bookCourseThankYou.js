Template.bookCourseThankYou.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe( 'singleCourseById', this.data.course );
});

Template.bookCourseThankYou.helpers({
	shareData: function () {
		var course = Courses.findOne( { _id : this.course }, { fields: { title: 1, description: 1, slug: 1 } } );
    var data = {
      title: course.title,
      description: course.description,
      url: Meteor.absoluteUrl() + 'course/' + course.slug
    };
    return data;
  }
});