Router.route('/', function () {
  // render the Home template with a custom data context
  // this.render('Home', {data: {title: 'My Title'}});
  this.render('home');
});

Router.route('/becomeTrainer'); // hier kurs-erzeugen
Router.route('/createCourse'); // soll weg und direkt nach course edit um zu vervollständigen
Router.route('/about');
Router.route('/login');

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
      return {
        course: Courses.findOne( {_id: this.params._id} ),
        inquired: Inquired.find( {course: this.params._id} ),
        current: Current.find( {course: this.params._id} ),
      }
    }
  });
}, {
  name: 'course.show'
});

Router.route('/course/:_id/edit', function () {
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
    // data: function () {
    //   return Meteor.users.findOne( {_id: this.params._id} );
    // }
    data: function () {
      return {
        user: Meteor.users.findOne( {_id: this.params._id} ),
        userCourses: Courses.find( { "current.participants": this.params._id} ) };
    }
  });
}, {
  name: 'userProfile.show'
});

Router.route('/user/:_id/edit', function () {
  this.render('editUserProfile', {
    data: function () {
      return Meteor.users.findOne( {_id: this.params._id} );
    }
  });
}, {
  name: 'userProfile.edit'
});

Router.plugin('dataNotFound', {notFoundTemplate: 'DataNotFound'});
Router.plugin('loading', {loadingTemplate: 'Loading'});

Router.configure({
  layoutTemplate: 'TCLayout'
});