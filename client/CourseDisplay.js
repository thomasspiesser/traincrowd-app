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
    var instanceId = event.target.name;
    var date = template.find('input:radio[name='+instanceId+']:checked');
    if (date) {
      var options = {
        courseId: template.data._id,
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