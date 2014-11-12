Router.route('/', function () {
  // render the Home template with a custom data context
  // this.render('Home', {data: {title: 'My Title'}});
  this.render('home');
});

Router.route('/admin', {
  onBeforeAction: function() {
    if (Meteor.loggingIn()) {
      this.render('loading');
    } else if (!Roles.userIsInRole(Meteor.user(), ['admin'])) {
      console.log('redirecting');
      this.redirect('/');
    }
    this.render('adminTemplate');
  }
});

Router.route('/createCourse');
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

Router.route('/editUserProfile/:_id', function () {
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