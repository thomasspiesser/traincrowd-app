Router.route('/', function () {
  // render the Home template with a custom data context
  // this.render('Home', {data: {title: 'My Title'}});
  this.render('home');
});

// when you navigate to "/one" automatically render the template named "One".
Router.route('/createCourse');
Router.route('/about');

Router.route('/search', function () {
  this.render('search', {
    data: function () {
      return Courses.find();
    }
  });
});

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

Router.route('/editCourse/:_id', function () {
  this.render('editCourse', {
    data: function () {
      return Courses.findOne( {_id: this.params._id} );
    }
  });
}, {
  name: 'course.edit'
});

Router.route('/course/:_id/inquiry', function () {
  this.render('courseInquiry', {
    data: function () {
      return Courses.findOne( {_id: this.params._id} );
    }
  });
}, {
  name: 'course.inquire'
});

Router.route('/user/:_id', function () {
  this.render('userProfile', {
    data: function () {
      return Meteor.users.findOne( {_id: this.params._id} );
    }
  });
}, {
  name: 'userProfile.show'
});

Router.route('/editUserProfile/:_id', function () {
  this.render('editUserProfile', {
    data: function () {
      return Meteor.users.findOne( {_id: this.params._id} );
    }
  });
}, {
  name: 'userProfile.edit'
});

Router.configure({
  layoutTemplate: 'TCLayout'
});