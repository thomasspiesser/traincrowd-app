//////////// coursePreview template /////////

Template.coursePreview.rendered = function () {
  $('.rateit').rateit();
};

Template.coursePreview.helpers({
  descriptionPreview: function () {
    if (! this.description)
      return false
    var descriptionPreview = this.description.replace("\n"," "); // remove linebreaks
    if (descriptionPreview.length > 100)
      return descriptionPreview.slice(0,100)+"...";
    else
      return descriptionPreview;
  }
});

//////////// courseDetail template /////////

Template.courseDetail.rendered = function() {
   $('[data-toggle="tooltip"]').tooltip() //initialize all tooltips in this template
   $('.rateit').rateit();
};

Template.courseDetail.helpers({
  trainerImageId: function (id) {
    var trainer = Meteor.users.findOne( {_id: id}, {fields: {"profile.imageId": 1}} );
    if (trainer.profile && trainer.profile.imageId)
      return trainer.profile.imageId;
    return false;
  },
  getCurrent: function () {
    return Current.find({course: this._id}, {fields: {participants: 1, courseDate:1} });
  },
  feePP: function () {
    return (this.fee / parseInt(this.minParticipants)).toFixed(2);
  }, 
  percentFull: function (course) {
    // data context is current
    return (this.participants.length / course.minParticipants ).toFixed(1) * 100;
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
  // 'click #declineDateButton': function () {
  //   // remove from inquired
  //   // send mail to inquirer that was not suitable
  // },
  'click .joinCourseButton': function (event, template) {
    Session.set("currentId", this._id);
    Session.set("currentDate", this.courseDate);
    $('#paymentModal').modal('show');
  }
});
