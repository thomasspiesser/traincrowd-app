Template.courseDetail.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip(); //initialize all tooltips in this template
  $('.rateit').rateit();
  if ( Session.get('showBookingModalOnReturn') && Meteor.userId() ) {
    Session.set('showBookingModalOnReturn', false);
    $('#paymentModal').modal('show');
  }
};

Template.courseDetail.events({
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  },
});

Template.courseDetail.helpers({
  isPublic: function () {
    return this.isPublic;
  },
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
    var commision = calcCommision( this.fee );
    return ( ( this.fee + commision ) / this.maxParticipants ).toFixed(2);
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
    Router.go("course.edit", {slug: this.slug} );
  },
  // 'click #requestPublicCourseButton': function () {
  //   if (confirm( "Anfrage zur Freigabe senden?" ) ) {
  //     if (!this._id || !this.title) {
  //       toastr.error( "Sie müssen eingeloggt sein und einen Kurstitel angeben." );
  //       return false;
  //     }
  //     var options = {
  //       what: 'Kurs',
  //       itemId: this._id,
  //       itemName: this.title
  //     };
  //     Meteor.call('sendRequestPublicationEmail', options, function (error, result) {
  //       if (error)
  //         toastr.error( error.reason );
  //       else
  //         toastr.success( 'Anfrage zur Freigabe gesendet.' );
  //     });
  //   }
  // },
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
    // var current = this;
    // var course = Template.parentData(1);
    // Meteor.call('createBooking', current._id, course._id, function (error, result) {
    //   if(error)
    //     toastr.error( error.reason );
    //   else
    //     Router.go('book.course', { _id: result } );
    // });
    // return false;
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
