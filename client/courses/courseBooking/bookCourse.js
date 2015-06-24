Template.bookCourse.rendered = function () {
  if ( ! Meteor.userId() )
    Session.set("bookCourseTemplate", "bookCourseRegister");
  else {
    Session.set("bookCourseTemplate", "bookCourseAddress");
    $('.progress-tracker').removeClass('active').addClass('inactive');
    $('#bookCourseAddress').children('.progress-tracker').removeClass('inactive').addClass('active');
  }
};

Template.bookCourse.helpers({
  deservesCheckBookCourseRegister: function () {
    return Meteor.userId() ? true : false;
  },
  deservesCheckBookCourseAddress: function () {
    var user = Meteor.user();
    return ! user.profile.street || ! user.profile.streetNumber || ! user.profile.plz || ! user.profile.city ? true : false;
  },
  deservesCheckBookCoursePaymentMethod: function () {
    return this.aims ? true : false;
  },
  deservesCheckBookCourseConfirm: function () {
    return this.maxParticipants && this.fee ? true : false;
  },
  active: function() {
    return Session.get('bookCourseTemplate');
  }
});

Template.bookCourse.events({ 
  'click .dynamic-template-selector': function (event) {
    Session.set('bookCourseTemplate', event.currentTarget.id);

    $('.progress-tracker').removeClass('active').addClass('inactive');
    $(event.currentTarget).children('.progress-tracker').removeClass('inactive').addClass('active');
  }
});


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

Template.paymentModal.helpers({
  bookedOut: function () {
    var current = Current.findOne({_id: Session.get('currentId')}, {fields: {participants: 1}});
    if (current && current.participants) {
      return current.participants.length === this.maxParticipants;
    }
    return false;
  },
  countdown: function () {
    return "bitte warten: " + Session.get('time');
  },
  message: function () {
    return Session.get("bookingMessage");
  },
  errorMessage: function () {
    return Session.get("errorMessage");
  },
  formatedDates: function () {
    var courseDate = Session.get("currentDate");
    var formatedDates = _.map(courseDate, function(date){
      return moment(date).format("DD.MM.YYYY");
    });
    return formatedDates;
  },
  feePP: function () {
    var commision = calcCommision( this.fee );
    return ( ( this.fee + commision ) / this.maxParticipants ).toFixed(2);
  }
});  

Template.paymentModal.events({
  'click #bookCourseButton': function (event, template) {
    // data context is still course: access using 'this.'
    var currentId = Session.get("currentId");

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
          else {
            toastr.success('Buchung erfolgreich.');
            // toastr.success('Bitte vervollständigen Sie jetzt Ihr Profil und teilen Sie uns Ihre Erwartungen mit. So kann sich ihr Trainer optimal auf Sie vorbereiten.');
            Meteor.setTimeout( redirect , 3000 );
          }
        });
      }
    };
    redirect = function( ) {
      Router.go('edit.user', {_id: Meteor.userId()});
    };
    var interval = Meteor.setInterval(timeLeft, 1000);
  },
  'click #modalCloseButton': function () {
    Session.set('errorMessage', '');
  }
});