//////////// coursePreview template /////////

Template.coursePreview.rendered = function () {
  $('.rateit').rateit();
  $('.course-preview-image img').each(function(){
    $(this).addClass(this.width > this.height ? '' : 'portrait');
  });
};

Template.coursePreview.helpers({
  trainerImageId: function (id) {
    var trainer = Meteor.users.findOne( {_id: id}, {fields: {"profile.imageId": 1}} );
    if (trainer.profile && trainer.profile.imageId)
      return trainer.profile.imageId;
    return false;
  },
  feePP: function () {
    return (this.fee / this.maxParticipants).toFixed(2);
  },
  titlePreview: function () {
    if ( !this.title ) {
      return false;
    }
    var titlePreview = this.title.replace("\n", " "); // remove linebreaks
    var breaker = 95;
    if ( titlePreview.length > breaker ) {
      return titlePreview.slice(0, breaker) + "...";
    }
    else {
      return titlePreview;
    }
  },
  descriptionPreview: function () {
    if ( !this.description ) {
      return false;
    }
    var descriptionPreview = this.description.replace("\n", " "); // remove linebreaks
    var breaker = 200;
    if (descriptionPreview.length > breaker) {
      return descriptionPreview.slice(0, breaker) + "...";
    }
    else {
      return descriptionPreview;
    }
  },
  nextEvent: function () {
    var nextEvent = _.pluck(this.dates, 0); // get first date object for every event
    if (nextEvent.length) {
      nextEvent = _.min( _.map( nextEvent, function (date) { return moment(date); } ) );
      return nextEvent.format("DD.MM.YYYY");
    }
    return 'Kein Event';
  }
});

//////////// courseDetail template /////////

Template.courseDetail.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip(); //initialize all tooltips in this template
  $('.rateit').rateit();
  $('.course-detail-head-image-wrapper img').addClass(function () { return this.width > this.height ? '' : 'portrait'; });
  if ( Session.get('showBookingModalOnReturn') ) {
    Session.set('showBookingModalOnReturn', false);
    $('#paymentModal').modal('show');
  }
};

Template.courseDetail.helpers({
  trainerImageId: function (id) {
    var trainer = Meteor.users.findOne( {_id: id}, {fields: {"profile.imageId": 1}} );
    if (trainer.profile && trainer.profile.imageId)
      return trainer.profile.imageId;
    return false;
  },
  getCurrent: function () {
    return Current.find({course: this._id}, {sort:{courseDate: 1}, fields: {participants: 1, courseDate:1} });
  },
  courseDateRange: function () {
    // context is current
    if (this.courseDate.length === 1)
      return moment(this.courseDate[0]).format("DD.MM.YYYY");
    if (this.courseDate.length > 1)
      return moment(_.first(this.courseDate) ).format("DD.MM") + ' - ' + moment(_.last(this.courseDate) ).format("DD.MM.YYYY");
  },
  feePP: function () {
    return (this.fee / parseInt(this.minParticipants)).toFixed(2);
  }, 
  percentFull: function (course) {
    // data context is current, which is why function get par: course
    if (course.maxParticipants)
      return (this.participants.length / course.maxParticipants ).toFixed(1) * 100;
    return 0;
  },
  bookedOut: function (course) {
    return this.participants.length === course.maxParticipants;
  },
  runtime: function (course) {
    var date = _.first(this.courseDate); // first day of the event
    if (course.expires) {
      // calc when the event expires: courseDate - no.of weeks before
      date = new Date(+date - 1000 * 60 * 60 * 24 * 7 * parseInt(course.expires)); // milliseconds in one second * seconds in a minute * minutes in an hour * hours in a day * days in a week * weeks
    }
    date=moment(date);
    var today = moment();
    return date.diff(today, 'days');
  },
  openSpots: function (course) {
    if (course.maxParticipants)
      return course.maxParticipants - this.participants.length;
  }
});

Template.courseDetail.events({
  'click #editCourseButton': function () {
    Router.go("course.edit", {_id: this._id} );
  },
  // 'click #inquireCourseDatesButton': function () {
  //   if (this.owner === Meteor.userId()) {
  //     toastr.error('This is your own course' );
  //     return false
  //   }
  //   var bookedCourse = _.find(this.current, function (item) { 
  //     return _.contains(item.participants, Meteor.userId() )
  //   });
  //   if (bookedCourse) {
  //     toastr.error('You alreday booked this course for the '+bookedCourse.courseDate );
  //     return false
  //   } else {
  //     Router.go("course.inquire", {_id: this._id} );
  //   }
  // },
  // 'click .confirmDateButton': function (event,template) {
  //   var date = template.find('input:radio[name='+this._id+']:checked');
  //   if (date) {
  //     var options = {
  //       courseId: this.course,
  //       courseOwner: this.owner,
  //       id: this._id,
  //       inquirer: this.inquirer,
  //       confirmedDate: date.value
  //     }
  //     Meteor.call('confirmInquired', options, function (error, result) {
  //       if(error) {
  //         toastr.error( error.reason );
  //       } else {
  //         // Session.set( "instanceId", result );
  //         toastr.success( 'Wenn sich genug Teilnehmer finden, findet Dein Kurs am' + date.value + 'statt.' );
  //       }
  //     });
  //     return false
  //   }
  //   else {
  //     toastr.error( 'Bitte einen Termin auswählen.' );
  //   }
  //   return false
  // },
  'click .joinCourseButton': function (event, template) {
    Session.set("currentId", this._id);
    Session.set("currentDate", this.courseDate);
    if ( !Meteor.userId() ) {
      Session.set('showBookingModalOnReturn', true);
      Router.go('atSignUp');
      return false;
    }
    else {
      $('#paymentModal').modal('show');
      return false;
    }
  }
});
