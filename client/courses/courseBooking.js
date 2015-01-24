//////////// courseInquiry template /////////

// Template.courseInquiry.rendered=function() {
//     $('#inquireDatesDatepicker').datepicker({
//       format: "dd/mm/yyyy",
//       weekStart: 1,
//       language: "de",
//       todayBtn: true,
//       multidate: true,
//       todayHighlight: true
//     });
// }

// Template.courseInquiry.events({
//   'click #cancelBookCourseButton': function () {
//     Router.go("course.show", {_id: this._id} );
//   },
//   'click #inquireCourseDatesButton': function (event, template) {
//     var inquiredDates = template.find("#inquireDatesDatepicker").value;
//     if (inquiredDates.length > 1) {
//       var courseId = this._id;
//       var inquiredDatesArray = inquiredDates.split(",");
//       var options = {
//         courseId: courseId,
//         courseOwner: this.owner,
//         dates: inquiredDatesArray
//       }
//       Meteor.call('createInquired', options, function (error, result) {
//         if(error) {
//           toastr.error(error.reason);
//         } else {
//           // Session.set( "instanceId", result );
//           Router.go("course.show", {_id: courseId} );
//           toastr.success('Successfully submitted dates to trainer.');
//         }
//       });
//     } else {
//       toastr.error('Please, choose at least one date!');
//     }
//     return false
//   }
// }); 

//////////// paymentModal template /////////

Template.paymentModal.events({
  'click #bookCourseButton': function (event, template) {
    // data context is still course: access using 'this.'
    var currentId = Session.get("currentId");

    var courseId = this._id;
    Session.set("bookingMessage",
                  "Simulation der Bezahlfunktion, warten auf den Callback des Bezahlanbieters!");
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
        // assume success, push userId into current.participants 
        Meteor.call('addParticipant', currentId, function (error, result) {
          if (error)
            toastr.error(error.reason);
          else
            toastr.success('Buchung erfolgreich.');
        });
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
  },
  currentDate: function () {
    return Session.get("currentDate");
  }
});  