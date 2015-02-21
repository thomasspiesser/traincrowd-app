var sm = new SubsManager();

// Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

Router.configure({
  loadingTemplate: 'loadingTemplate',
  // notFoundTemplate: 'notFound',
  layoutTemplate: 'TCLayout'
});

/////////////////// Home ////////////////////////

Router.route('/', function () {
  // render the Home template with a custom data context
  // this.render('Home', {data: {title: 'My Title'}});
  this.render('home');
}, {
  name: 'home'
});

/////////////////// Gatekeeper ////////////////////////

Router.route('/gatekeeper', function () {
  this.layout('gatekeeperLayout');
  this.render('gatekeeper');
});

passProtect= function () {
  if ( !Session.get("gatekey") ) {
    // if the keyword is not there, render the gatekeeper template
    Router.go('gatekeeper')
    this.next();
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function from running
    this.next();
  }
}

Router.onBeforeAction(passProtect);

/////////////////// Officials ////////////////////////

Router.route('/faq'); 
Router.route('/contact');
Router.route('/aboutUs');
Router.route('/agb');
Router.route('/dataProtection');
Router.route('/impressum');

/////////////////// Courses ////////////////////////

Router.route('/createCourse'); // hier kurs-erzeugen

Router.route('/berlins-top-kurse', {
  template: 'search',
  name: 'search',
  waitOn: function() {
    return sm.subscribe('courses');
  },
  data: function () { 
    return {courses: Courses.find({ public: true })};
  }
});

// Router.route('/courses', {
//   waitOn: function() {
//     return sm.subscribe('courses');
//   },
//   data: function () { 
//     return {courses: Courses.find({ public: true })};
//   }
// });

Router.route('/course/:_id', {
  template: 'courseDetail',
  name: 'course.show',
  waitOn: function() {
    return Meteor.subscribe('singleCourse', this.params._id);
  },
  data: function () {
    return Courses.findOne( {_id: this.params._id} );
  }
});

Router.route('/course/:_id/edit', {
  template: 'editCourse',
  name: 'course.edit',
  waitOn: function() {
    return Meteor.subscribe('singleCourse', this.params._id);
  },
  data: function () {
    return Courses.findOne( {_id: this.params._id} );
  }
});

Router.route('/course/:_id/confirm-event/:_token', {
  template: 'courseConfirm',
  name: 'course.confirm',
  waitOn: function() {
    return Meteor.subscribe('singleCourse', this.params._id);
  },
  data: function () {
    Session.set('token', this.params._token);
    return {
      course: Courses.findOne( {_id: this.params._id} ),
      current: Current.findOne( { token: this.params._token } )
    }
  }
  });

// Router.route('/course/:_id/confirm-event/:_token', function () {
//   Session.set('token', this.params._token);
//   this.render('courseConfirm', {
//     data: function () {
//       return {
//         course: Courses.findOne( {_id: this.params._id} ),
//         current: Current.findOne( { token: this.params._token } )
//       }
//     }
//   });
// }, {
//   name: 'course.confirm'
// });

Router.route('/user-courses', {
  template: 'userCourses',
  name: 'user.courses',
  waitOn: function() {
    return Meteor.subscribe('courses');
  }
});

/////////////////// Profile ////////////////////////

Router.route('/becomeTrainerLanding'); // hier ankommen von werde trainer link

Router.route('/profile/:_id', {
  template: 'userProfile',
  name: 'userProfile.show',
  data: function () {
    return Meteor.users.findOne( {_id: this.params._id} );
  },
  waitOn: function() {
    return Meteor.subscribe('courses');
  }
});

Router.route('/edit-profile', {
  template: 'editUserProfile',
  name: 'userProfile.edit',
  data: function () {
    return Meteor.users.findOne( {_id: Meteor.userId()} );
  }
});

Router.route('/new-trainer', {
  template: 'newTrainer',
  name: 'new.trainer', 
  onBeforeAction: function(pause){
    var userId = Meteor.userId();
    if (!userId) {
      Router.go('atSignUp');
    }
    else {
      Meteor.call('updateRoles', function (error, results) {
        if (error)
          toastr.error( error.reason );
        else 
          Router.go('userProfile.edit', {_id: userId});
      });
      this.next();
    }
  }
});