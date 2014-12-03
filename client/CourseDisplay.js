//////////// course template /////////

//////////// courseDetail template /////////

Template.courseDetail.events({
  'click #editCourseButton': function () {
    Router.go("course.edit", {_id: this._id} );
  },
  'click #inquireCourseDatesButton': function () {
    if (this.owner === Meteor.userId()) {
      Notifications.error('Sorry', 'This is your own course', {timeout: 5000});
      return false
    }
    var bookedCourse = _.find(this.current, function (item) { 
      return _.contains(item.participants, Meteor.userId() )
    });
    if (bookedCourse) {
      Notifications.error('Course already booked', 'You alreday booked this course for the '+bookedCourse.courseDate, {timeout: 5000});
      return false
    } else {
      Router.go("course.inquire", {_id: this._id} );
    }
  },
  'click .confirmDateButton': function (event,template) {
    var date = template.find('input:radio[name='+this._id+']:checked');
    if (date) {
      var options = {
        courseId: this.course,
        courseOwner: this.owner,
        id: this._id,
        inquirer: this.inquirer,
        confirmedDate: date.value
      }
      Meteor.call('confirmInquired', options, function (error, result) {
        if(error) {
          Notifications.error('Fehler!', error, {timeout: 5000});
        } else {
          // Session.set( "instanceId", result );
          Notifications.info('Super!', 'Wenn sich genug Teilnehmer finden, findet Dein Kurs am' + date.value + 'statt.', {timeout: 5000});
        }
      });
      return false
    }
    else {
      Notifications.error('Fehler!', 'Bitte einen Termin auswählen.', {timeout: 5000});
    }
    return false
  },
  'click #declineDateButton': function () {
    // remove from inquired
    // send mail to inquirer that was not suitable
  },
  'click .joinCourseButton': function (event, template) {
    console.log(this)
    return false
    var instanceId = this._id;
    $("#bookCourseButton").attr('name',instanceId); // pass the instanceId to modal through name
    $('#paymentModal').modal('show');
  }
});

//////////// pinboard template /////////

Template.pinboard.helpers({
  pinboard: function () {
    var bookedCourse = _.find(this.current, function (item) { 
      return _.contains(item.participants, Meteor.userId() )
    });
    return Pinboards.findOne( {courseInstance: bookedCourse.instanceId}, { sort: { timestamp: -1 }} );
  },
  pinboards: function () {
    if ( this.owner === Meteor.userId() ) {
      return Pinboards.find( {owner: Meteor.userId(), course: this._id} , { sort: { timestamp: -1 }})
    }
  }
});

Template.pinboard.events({
  'click .submitMessageButton': function (event, template) {
    processMessage(this, event, template);
  },
  'submit .form-inline': function (event, template) {
    event.preventDefault();
    processMessage(this, event, template);
  }
});

var processMessage = function (self, event, template) {
    var text = template.find('#inputField'+self._id).value;
    var user = Meteor.userId();
    var userName = Meteor.user().profile.name;
    if (typeof userName === 'undefined') {
      var userName = Meteor.user().emails[0].address;
    }
    var message = {
      message: text,
      user: user,
      userName: userName,
      timestamp: new Date()
    };

    if (text.length) {
      Meteor.call('insertMessage', {pinboardId: self._id, message: message});
      $('#pinboardForm'+self._id)[0].reset();
    } else {
      Notifications.error('Leere Nachricht', 'Bitte gib deine Nachricht ein.', {timeout: 5000});
    }
    return false
}