Template.userCourses.helpers({ 
  showDateOrNoOfParticipants: function (course, helperId) {
    var bookedCourse = _.find(course.current, function (item) { 
      return _.contains(item.participants, Meteor.userId() )
    });
    if (helperId === 1) {
      return bookedCourse.courseDate;
    } else if (helperId === 2) {
      return bookedCourse.participants.length;
    }
  },
  log: function(){
    console.log(this);
  }
});