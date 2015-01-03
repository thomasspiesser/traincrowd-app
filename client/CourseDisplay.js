//////////// course template /////////

//////////// courseDetail template /////////

Template.courseDetail.rendered = function() {
   $('[data-toggle="tooltip"]').tooltip() //initialize all tooltips in this template
};

Template.courseDetail.helpers({
  trainerProfilePicture: function (id) {
    return Meteor.users.findOne( {_id: id}, {fields: {"profile.profilePicture": 1}} ).profile.profilePicture;
  },
  datesArray: function () {
    if (this.dates) {
      return this.dates.split(",");
    } 
    // else
      // return []

  }
});

Template.courseDetail.events({
  'click #editCourseButton': function () {
    Router.go("course.edit", {_id: this.course._id} );
  },
  // 'click #inquireCourseDatesButton': function () {
  //   if (this.owner === Meteor.userId()) {
  //     Notifications.error('Sorry', 'This is your own course', {timeout: 5000});
  //     return false
  //   }
  //   var bookedCourse = _.find(this.current, function (item) { 
  //     return _.contains(item.participants, Meteor.userId() )
  //   });
  //   if (bookedCourse) {
  //     Notifications.error('Course already booked', 'You alreday booked this course for the '+bookedCourse.courseDate, {timeout: 5000});
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
  //         Notifications.error('Fehler!', error, {timeout: 5000});
  //       } else {
  //         // Session.set( "instanceId", result );
  //         Notifications.info('Super!', 'Wenn sich genug Teilnehmer finden, findet Dein Kurs am' + date.value + 'statt.', {timeout: 5000});
  //       }
  //     });
  //     return false
  //   }
  //   else {
  //     Notifications.error('Fehler!', 'Bitte einen Termin auswählen.', {timeout: 5000});
  //   }
  //   return false
  // },
  // 'click #declineDateButton': function () {
  //   // remove from inquired
  //   // send mail to inquirer that was not suitable
  // },
  'click .joinCourseButton': function (event, template) {
    console.log(this)
    return false
    var instanceId = this._id;
    $("#bookCourseButton").attr('name',instanceId); // pass the instanceId to modal through name
    $('#paymentModal').modal('show');
  }
});
