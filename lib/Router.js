var sm = new SubsManager();

Router.configure({
  loadingTemplate: 'loadingTemplate',
  notFoundTemplate: 'notFound',
  layoutTemplate: 'TCLayout'
});

Router.onBeforeAction('dataNotFound');

/////////////////// Home ////////////////////////

Router.route('/', function () {
  // render the Home template with a custom data context
  // this.render('Home', {data: {title: 'My Title'}});
  this.render('home');
}, {
  name: 'home'
});

/////////////////// Officials ////////////////////////

Router.route('/faq'); 
Router.route('/contact');
Router.route('/aboutUs');
Router.route('/agb');
Router.route('/dataProtection');
Router.route('/impressum');

/////////////////// Courses ////////////////////////

Router.route('/createCourse'); // hier kurs-erzeugen

Router.route('/kurs-buchen', {
  template: 'bookCourse',
  name: 'book.course',
  // waitOn: function() {
  //   return sm.subscribe('courses');
  // }
});

Router.route('/berlins-top-kurse', {
  template: 'searchCourse',
  name: 'search.course',
  waitOn: function() {
    return sm.subscribe('courses');
  }
});

Router.route('/course/:slug', {
  template: 'courseDetail',
  name: 'course.show',
  waitOn: function() {
    return Meteor.subscribe('singleCourse', this.params.slug);
  },
  data: function () {
    return Courses.findOne( {slug: this.params.slug} );
  }
});

Router.route('/course/:slug/edit', {
  template: 'editCourse',
  name: 'course.edit',
  waitOn: function() {
    return Meteor.subscribe('singleCourse', this.params.slug);
  },
  data: function () {
    return Courses.findOne( {slug: this.params.slug} );
  }
});

Router.route('/course/:slug/confirm-event/:_token', {
  template: 'courseConfirm',
  name: 'course.confirm',
  waitOn: function() {
    return Meteor.subscribe('singleCourse', this.params.slug);
  },
  data: function () {
    Session.set('token', this.params._token);
    return {
      course: Courses.findOne( {slug: this.params.slug} ),
      current: Current.findOne( { token: this.params._token } )
    };
  }
});

Router.route('/course/:slug/decline-event/:_token', {
  template: 'courseDecline',
  onBeforeAction: function(pause){
    Meteor.call('declineEvent', this.params._token, function (error) {
      if (error)
        toastr.error( error.reason );
      else
        this.next();
    });
  }
});

Router.route('/user-courses', {
  template: 'userCourses',
  name: 'user.courses',
  waitOn: function() {
    return sm.subscribe('courses');
  }
});

/////////////////// Trainer ////////////////////////

Router.route('/berlins-top-trainer', {
  template: 'searchTrainer',
  name: 'search.trainer',
  waitOn: function() {
    return sm.subscribe('courses');
  }
});

/////////////////// Profile ////////////////////////

Router.route('/becomeTrainerLanding'); // hier ankommen von werde trainer link

Router.route('/profile/:_id', {
  template: 'trainerProfile',
  name: 'trainerProfile.show',
  data: function () {
    return Meteor.users.findOne( {_id: this.params._id} );
  },
  waitOn: function() {
    return Meteor.subscribe('courses');
  }
});

Router.route('/edit-trainer-profile', {
  template: 'editTrainerProfile',
  name: 'trainerProfile.edit',
  data: function () {
    return Meteor.users.findOne( {_id: Meteor.userId()} );
  }
});

Router.route('/edit-user-profile', {
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
          Router.go('trainerProfile.edit', {_id: userId});
      });
      this.next();
    }
  }
});