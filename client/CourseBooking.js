//////////// courseInquiry template /////////

Template.courseInquiry.rendered=function() {
    $('#inquireDatesDatepicker').datepicker({
      format: "dd/mm/yyyy",
      weekStart: 1,
      language: "de",
      todayBtn: true,
      multidate: true,
      todayHighlight: true
    });
}

Template.courseInquiry.events({
  'click #cancelBookCourseButton': function () {
    Router.go("course.show", {_id: this._id} );
  },
  'click #inquireCourseDatesButton': function (event, template) {
    var inquiredDates = template.find("#inquireDatesDatepicker").value;
    if (inquiredDates.length > 1) {
      var inquiredDatesArray = inquiredDates.split(",");
      var instanceId = inquireNewCourseDates({ courseId:this._id, dates: inquiredDatesArray });
      Session.set("createError", "");
      Router.go("course.show", {_id: this._id} );
      Notifications.info('Course date inquiry!', 'Successfully submitted dates to trainer.', {timeout: 5000});
    } else {
      Notifications.error('Error!', 'Please, choose at least one date!', {timeout: 5000});
      Session.set("createError",
                  "Please, choose at least one date!");
    }
    return false
  }
}); 

//////////// paymentModal template /////////

Template.paymentModal.events({
  'click #bookCourseButton': function (event, template) {
    var instanceId = event.target.name;
    var currentCourse = _.findWhere(this.current, {instanceId: instanceId});
    // data context is still course: access using 'this.'
    if (Meteor.userId() === this.owner) {
      Session.set('errorMessage', 'You cannot book your own course!');
      return false
    }
    if (_.contains(currentCourse.participants, Meteor.userId())) {
      Session.set('errorMessage', 'You already booked this course!');
      return false
    }

    var courseId = this._id;
    Session.set("bookingMessage",
                  "Contact external service, wait for callback success/error!");
    var clock = 5;
    timeLeft = function(){
      if (clock > 0) {
        clock--;
        Session.set('time',clock);
      } else {
        Session.set('time','');
        Session.set("bookingMessage",'');
        Meteor.clearInterval(interval);
        Session.set('errorMessage', '');
        $('#paymentModal').modal('hide');
        // assume success, push userId into current.participants if not already there
        var options = {
          courseId: courseId,
          instanceId: instanceId,
          userId: Meteor.userId()
        }
        Meteor.call('addParticipant', options);  
      }
    }
    var interval = Meteor.setInterval(timeLeft, 1000);
  },
  'click #modalCloseButton': function () {
    Session.set('errorMessage', '');
  }
});

Template.paymentModal.helpers({
  countdown: function () {
    return "wait for it: "+Session.get('time');
  },
  message: function () {
    return Session.get("bookingMessage");
  },
  errorMessage: function () {
    return Session.get("errorMessage");
  }
});  