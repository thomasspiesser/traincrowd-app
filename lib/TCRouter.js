Router.route('/', function () {
  // render the Home template with a custom data context
  // this.render('Home', {data: {title: 'My Title'}});
  this.render('home');
});

// when you navigate to "/one" automatically render the template named "One".
Router.route('/createCourse');
Router.route('/about');

Router.route('/courses', function () {
  this.render('courses', {
    data: function () {
      return {courses: Courses.find()};
    }
  });
});

Router.route('/course/:_id', function () {
  this.render('courseDetail', {
    data: function () {
      return Courses.findOne( {_id: this.params._id} );
    }
  });
}, {
  name: 'course.show'
});

Router.configure({
  layoutTemplate: 'TCLayout'
});