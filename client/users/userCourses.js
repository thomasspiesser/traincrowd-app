Template.userCourses.rendered = function () {
  $('.rateit').rateit();
};

Template.userCourses.helpers({ 
  hostedCourses: function () {
    return Courses.find( { owner: Meteor.userId() }, {fields: {imageId:1, title:1, rating:1, public:1}} )
  },
  inquiredCourses: function () {
    var inquired = Inquired.find( { inquirer: Meteor.userId() }, {fields: {course:1, inquiredDates:1}} ).fetch();
    if (inquired.length) {
      for (var i = 0; i < inquired.length; i++) {
        var courseId = inquired[i].course
        var course = Courses.findOne( { _id: courseId }, {fields: {imageId:1, title:1, rating:1}} )
        delete course._id;
        _.extend(inquired[i],course);
      }
      return inquired;
    }
    else
      return false
  },
  currentCourses: function () {
    var current = Current.find( { participants: Meteor.userId() }, { fields: { course: 1, courseDate: 1 } } ).fetch();

    if (current.length) {
      for (var i = 0; i < current.length; i++) {
        var courseId = current[i].course
        var course = Courses.findOne( { _id: courseId }, { fields: { imageId: 1, title: 1, rating:1 } } )
        delete course._id;
        _.extend(current[i],course);
      }
      return current;
    }
    else
      return false
  },
  elapsedCourses: function () {
    var elapsed = Elapsed.find( { participants: Meteor.userId() }, { fields: { course: 1, courseDate: 1 } } ).fetch();
    if (elapsed.length) {
      for (var i = 0; i < elapsed.length; i++) {
        var courseId = elapsed[i].course
        var course = Courses.findOne( { _id: courseId }, { fields: { imageId: 1, title: 1, rating: 1 } } );
        delete course._id;
        _.extend( elapsed[i], course );
      }
      return elapsed;
    }
    else
      return false
  },
  formated: function (courseDate) {
    return _.map(courseDate, function(date) {return moment(date).format("DD.MM.YYYY"); } );
  },
  myRating: function (id) {
    var elapsed = Elapsed.findOne( {_id: id }, {fields: {ratings:1}} );
    var myRating = _.find(elapsed.ratings, function (item) { return item.participant === Meteor.userId(); });
    if (myRating) {
      Session.set(id, myRating.rating);
      return true;
    }
    else {
      Session.set(id, [0,0,0,0,0]);
      return false;
    }
  }
});

Template.userCourses.events({
  'click .rateCourse': function () {
    Session.set("rateId", this._id);
    var ratedValues = Session.get(this._id); // [1,2,3,4,5]
    $('.rateitModal0').rateit('value', ratedValues[0]);
    $('.rateitModal1').rateit('value', ratedValues[1]);
    $('.rateitModal2').rateit('value', ratedValues[2]);
    $('.rateitModal3').rateit('value', ratedValues[3]);
    $('.rateitModal4').rateit('value', ratedValues[4]);
    $('#ratingModal').modal('show');
  }
});

Template.ratingModal.rendered = function () {
  $('.rateit').rateit();
};

Template.ratingModal.events({
  'click #saveRating': function (event, template) {
    var ratedValue0 = parseFloat(template.find('#backing0').value);
    var ratedValue1 = parseFloat(template.find('#backing1').value);
    var ratedValue2 = parseFloat(template.find('#backing2').value);
    var ratedValue3 = parseFloat(template.find('#backing3').value);
    var ratedValue4 = parseFloat(template.find('#backing4').value);
    ratedValues = [ratedValue0, ratedValue1, ratedValue2, ratedValue3, ratedValue4];

    modifier = {_id: Session.get("rateId"),
                ratedValues: ratedValues }
    Meteor.call('rateCourse', modifier, function (error, result) {
      if (error)
        toastr.error( error.reason );
      else {
        toastr.success( 'Gespeichert.' );
        Session.set("rateId", "");
        $('#ratingModal').modal('hide');
      }
    });    
  }
});