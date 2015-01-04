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
  },
  hostedCourses: function () {
    return Courses.find( { owner: Meteor.userId() }, {fields: {logo:1, title:1, rating:1}} )
  },
  inquiredCourses: function () {
    var inquired = Inquired.find( { inquirer: Meteor.userId() }, {fields: {course:1, inquiredDates:1}} ).fetch();
    if (inquired.length) {
      for (var i = 0; i < inquired.length; i++) {
        var courseId = inquired[i].course
        var course = Courses.findOne( { _id: courseId }, {fields: {_id:0, logo:1, title:1, rating:1}} )
        _.extend(inquired[i],course);
      }
      return inquired;
    }
    else
      return false
  },
  currentCourses: function () {
    var current = Current.find( { "current.participants": Meteor.userId() }, {fields: {course:1, courseDate:1}} ).fetch();
    if (current.length) {
      for (var i = 0; i < current.length; i++) {
        var courseId = current[i].course
        var course = Courses.findOne( { _id: courseId }, {fields: {_id:0, logo:1, title:1, rating:1}} )
        _.extend(current[i],course);
      }
      return current;
    }
    else
      return false
  },
  elapsedCourses: function () {
    var elapsed = Elapsed.find( { participants: Meteor.userId() }, {fields: {course:1, courseDate:1}} ).fetch();
    if (elapsed.length) {
      for (var i = 0; i < elapsed.length; i++) {
        var courseId = elapsed[i].course
        var course = Courses.findOne( { _id: courseId }, {fields: {logo:1, title:1, rating:1}} )
        delete course._id;
        _.extend(elapsed[i],course);
      }
      return elapsed;
    }
    else
      return false
  },
  myRating: function (id) {
    var elapsed = Elapsed.findOne( {_id: id }, {fields: {ratings:1}} );
    var myRating = _.find(elapsed.ratings, function (item) {
      return item.participant === Meteor.userId();
      });
    console.log(myRating)
    if (typeof myRating !== 'undefined')
      return (myRating.rating).toString() // toString coz if 0 then = false
    else
      return false
  }
});