Router.route('/', function () {
  // render the Home template with a custom data context
  // this.render('Home', {data: {title: 'My Title'}});
  this.render('home');
}, {
  name: 'home'
});

// Router.route('/gatekeeper', function () {
//   this.layout('gatekeeperLayout');
//   this.render('gatekeeper');
// });

// passProtect= function () {
//   if ( !Session.get("gatekey") ) {
//     // if the keyword is not there, render the gatekeeper template
//     Router.go('gatekeeper')
//     this.next();
//   } else {
//     // otherwise don't hold up the rest of hooks or our route/action function from running
//     this.next();
//   }
// }

// Router.onBeforeAction(passProtect);

Router.route('/becomeTrainerLanding'); // hier ankommen von werde trainer link
Router.route('/createCourse'); // hier kurs-erzeugen

Router.route('/about');
// Router.route('/login');

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
      return {courses: Courses.find({ public: true})};
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

Router.route('/course/:_id/edit', function () {
  this.render('editCourse', {
    data: function () {
      return Courses.findOne( {_id: this.params._id} );
    }
  });
}, {
  name: 'course.edit'
});

// Router.route('/course/:_id/inquiry', function () {
//   this.render('courseInquiry', {
//     data: function () {
//       return Courses.findOne( {_id: this.params._id} );
//     }
//   });
// }, {
//   name: 'course.inquire'
// });

Router.route('/user-courses', {
  template: 'userCourses',
  name: 'user.courses'
});

Router.route('/profile/:_id', function () {
  this.render('userProfile', {
    data: function () {
      return Meteor.users.findOne( {_id: this.params._id} );
    }
    // data: function () {
    //   return {
    //     user: Meteor.users.findOne( {_id: this.params._id} ),
    //     userCourses: Courses.find( { "current.participants": this.params._id} ) };
    // }
  });
}, {
  name: 'userProfile.show'
});

Router.route('/profile/:_id/edit', function () {
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