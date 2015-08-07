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
    if ( ! this.billingAddress) 
      return false;
    var address = this.billingAddress;
    return address.street || address.streetNumber || address.plz || address.city ? true : false;
  },
  deservesCheckBookCoursePaymentMethod: function () {
    return this.paymentMethod ? true : false;
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

//////////// paymentModal template /////////

Template.paymentModal.helpers({
  bookedOut: function () {
    var current = Current.findOne({_id: Session.get('currentId')}, {fields: {participants: 1}});
    if (current && current.participants) {
      return current.participants.length === this.maxParticipants;
    }
    return false;
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