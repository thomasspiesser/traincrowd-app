var sm = new SubsManager();

Router.configure({
  loadingTemplate: 'loadingTemplate',
  notFoundTemplate: 'notFound',
  layoutTemplate: 'TCLayout',
});

if ( Meteor.isClient ) {
  let backToPosition;
  let scrollPosition;
  window.onpopstate = function() {
    backToPosition = scrollPosition;
  };
  let IRHooks = {
    scrollUp() {
      $('body,html').animate({
        scrollTop: backToPosition || 0
      }, 300 );
      backToPosition = undefined;
      this.next();
    },
    saveScrollPosition() {
      scrollPosition = $(window).scrollTop();
    },
  };
  Router.onBeforeAction( IRHooks.scrollUp );
  Router.onStop( IRHooks.saveScrollPosition );
}


/////////////////// Home ////////////////////////

Router.route('/', {
  template: 'home',
  name: 'home',
});

/////////////////// Officials ////////////////////////

Router.route('/haeufige-Fragen', {
  template: 'faq',
  name: 'faq',
});

Router.route('/Kontakt', {
  template: 'contact',
  name: 'contact',
});

Router.route('/ueber-traincrowd', {
  template: 'aboutTraincrowd',
  name: 'about.traincrowd',
});

Router.route('/ueber-das-team', {
  template: 'aboutUs',
  name: 'about.us',
});

Router.route('/allgemeine-Geschaeftsbedingungen', {
  template: 'agb',
  name: 'agb',
});

Router.route('/Datenschutz', {
  template: 'privacy',
  name: 'privacy',
});

Router.route('/impressum');

Router.route('/close-window', function() {
  window.close();
});

/////////////////// Courses ////////////////////////

Router.route('/createCourse'); // hier kurs-erzeugen

Router.route('/kurs-buchen/:_id/:state?', {
  template: 'bookCourse',
  name: 'book.course',
  waitOn() {
    return Meteor.subscribe( 'bookings', this.params._id );
  },
  data() {
    return Bookings.findOne( { _id: this.params._id } );
  },
  onBeforeAction() {
    if ( this.data().bookingStatus === 'completed' ) {
      this.params.state = 'bookCourseShare';
    }
    if ( ! this.params.state || ! Meteor.userId() ) {
      this.params.state = 'bookCourseRegister'; // default state
    }
    if ( this.params.state === 'bookCourseRegister' && Meteor.userId() ) {
      this.params.state = 'bookCourseAddress'; // has registered - go to address
    }
    this.next();
  },
});

Router.route('/kurs-buchen-abgeschlossen/:_id', {
  template: 'bookCourseThankYou',
  name: 'book.course.thank.you',
  waitOn() {
    return Meteor.subscribe( 'bookings', this.params._id );
  },
  data() {
    return Bookings.findOne( { _id: this.params._id } );
  },
});

Router.route('/berlins-top-kurse', {
  template: 'searchCourse',
  name: 'search.course',
  // waitOn() {
  //   return sm.subscribe('courses');
  // },
});

Router.route('/course/:slug', {
  template: 'courseDetail',
  name: 'course.show',
  waitOn() {
    return sm.subscribe( 'singleCourse', this.params.slug );
  },
  data() {
    return Courses.findOne( { slug: this.params.slug } );
  },
  onAfterAction() {
    let course;
    let image;
    // The SEO object is only available on the client.
    // Return if you define your routes on the server, too.
    if (!Meteor.isClient) {
      return;
    }
    course = this.data();
    if ( ! course ) return;
    if ( course.imageId ) {
      image = course.imageId;
    } else {
      let trainer = Meteor.users.findOne( { _id: course.owner }, {
        fields: { 'profile.imageId': 1 },
      });
      if ( trainer && trainer.profile && trainer.profile.imageId ) {
        image = trainer.profile.imageId;
      } else {
        image = '/images/Landing-top.jpeg';
      }
    }
    image = image.replace(/^https:\/\//i, 'http://');
    SEO.set({
      title: course.title,
      meta: {
        description: course.description,
      },
      og: {
        title: course.title,
        description: course.description,
        image: image,
      },
    });
  },
});

Router.route('/course/:slug/edit', {
  template: 'editCourse',
  name: 'course.edit',
  waitOn() {
    return Meteor.subscribe('singleCourse', this.params.slug);
  },
  data() {
    return Courses.findOne( { slug: this.params.slug } );
  },
});

Router.route('/course/:slug/confirm-event/:_token', {
  template: 'courseConfirm',
  name: 'course.confirm',
  waitOn() {
    return [
      Meteor.subscribe( 'singleCourse', this.params.slug ),
      Meteor.subscribe('current'),
    ];
  },
  data() {
    Session.set( 'token', this.params._token );
    return {
      course: Courses.findOne( { slug: this.params.slug } ),
      current: Current.findOne( { token: this.params._token } ),
    };
  },
});

Router.route('/course/:slug/decline-event/:_token', {
  template: 'courseDecline',
  onBeforeAction() {
    Meteor.call('declineEvent', this.params._token, function( error ) {
      if ( error ) {
        toastr.error( error.reason );
      } else {
        this.next();
      }
    });
  },
});

Router.route('/event/:id/rate-event/:_token', {
  template: 'rateCourse',
  name: 'rate.course',
  waitOn() {
    return [
      Meteor.subscribe( 'elapsedById', this.params.id ),
      Meteor.subscribe( 'userByToken', this.params._token ),
    ];
  },
  data() {
    return {
      elapsed: Elapsed.findOne( { _id: this.params.id } ),
      user: Meteor.users.findOne( { rateTokens: this.params._token } ),
    };
  },
});

Router.route('/user-courses', {
  template: 'userCourses',
  name: 'user.courses',
  waitOn() {
    return sm.subscribe('courses');
  },
});

/////////////////// Trainer ////////////////////////

Router.route('/berlins-top-trainer', {
  template: 'searchTrainer',
  name: 'search.trainer',
});

/////////////////// Profile ////////////////////////

Router.route('/becomeTrainerLanding'); // hier ankommen von werde trainer link

Router.route('/profile/:slug', {
  template: 'trainerProfile',
  name: 'trainerProfile.show',
  data() {
    return Meteor.users.findOne( { slug: this.params.slug } );
  },
  waitOn() {
    return Meteor.subscribe('courses');
  },
  onAfterAction() {
    let trainer;
    let image;
    // The SEO object is only available on the client.
    // Return if you define your routes on the server, too.
    if (!Meteor.isClient) {
      return;
    }
    trainer = this.data();
    if ( ! trainer ) return;
    if ( trainer.profile && trainer.profile.imageId ) {
      image = trainer.profile.imageId;
    } else {
      image = '/images/Landing-top.jpeg';
    }
    image = image.replace(/^https:\/\//i, 'http://');
    SEO.set({
      title: trainer.profile.name,
      meta: {
        description: trainer.profile.description,
      },
      og: {
        title: trainer.profile.name,
        description: trainer.profile.description,
        image: image,
      },
    });
  },
});

Router.route('/edit-trainer-profile', {
  template: 'editTrainer',
  name: 'edit.trainer',
  data() {
    return Meteor.users.findOne( {_id: Meteor.userId()} );
  },
});

Router.route('/edit-user-profile', {
  template: 'editUser',
  name: 'edit.user',
  data() {
    return Meteor.users.findOne( {_id: Meteor.userId()} );
  },
});

Router.route('/new-trainer', {
  template: 'newTrainer',
  name: 'new.trainer',
  onBeforeAction() {
    var userId = Meteor.userId();
    if (!userId) {
      Router.go('atSignUp');
    } else {
      Meteor.call('updateRoles', function( error ) {
        if ( error ) {
          toastr.error( error.reason );
        } else {
          Router.go('edit.trainer', {_id: userId});
        }
      });
      this.next();
    }
  },
});
