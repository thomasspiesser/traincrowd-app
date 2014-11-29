//////////// course template /////////

//////////// courseDetail template /////////

Template.courseDetail.events({
  'click #remove': function () {
    Meteor.call('removeFromCurrent', "5sMs79akgARhgrZRs");
  },
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
    var instanceId = event.target.name;
    var date = template.find('input:radio[name='+instanceId+']:checked');
    if (date) {
      var options = {
        courseId: template.data._id,
        courseOwner: template.data.owner,
        instanceId: this.instanceId,
        confirmedDate: date.value,
        inquirer: this.inquirer
      }
      Meteor.call('confirmCourseDate', options);
      Session.set("createError", "");
      return false
    }
    else {
      Session.set("createError",
                  "Please, select a date to confirm!");
    }
  },
  'click .joinCourseButton': function (event, template) {
    var instanceId = event.target.name;
    $("#bookCourseButton").attr('name',instanceId); // pass the instanceId to modal through name
    $('#paymentModal').modal('show');
  }
});

//////////// pinboard template /////////

Template.pinboard.helpers({
  isParticipant: function () {
    var bookedCourse = _.find(this.current, function (item) { 
      return _.contains(item.participants, Meteor.userId() )
    });
    if (bookedCourse) {
      return true
    }
    return false
  },
  isOwner: function () {
    return this.owner === Meteor.userId() 
  },
  pinboard: function () {
    var bookedCourse = _.find(this.current, function (item) { 
      return _.contains(item.participants, Meteor.userId() )
    });
    return Pinboards.findOne( {courseInstance: bookedCourse.instanceId} );
  },
  pinboards: function () {
    if ( this.owner === Meteor.userId() ) {
      return Pinboards.find( {owner: Meteor.userId(), course: this._id} )
    }
  }
});

Template.pinboard.events({
  'click .submitMessageButton': function (event, template) {
    var text = template.find('#inputField'+this._id).value;
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
      Meteor.call('insertMessage', {pinboardId: this._id, message: message});
      $('#pinboardForm'+this._id)[0].reset();
    } else {
      Notifications.error('Leere Nachricht', 'Bitte gib deine Nachricht ein.', {timeout: 5000});
    }
    return false
  }
});