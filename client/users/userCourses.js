Template.userCourses.rendered = function () {
  $('.rateit').rateit();
};

Template.userCourses.helpers({ 
  isPublic: function () {
    return this.isPublic ? "true" : undefined;
  },
  hasPublishRequest: function () {
    return this.hasPublishRequest ? "true" : undefined;
  },
  hostedCourses: function () {
    return Courses.find( { owner: Meteor.userId() }, { fields: { imageId: 1, title: 1, description: 1, categories: 1, aims: 1, maxParticipants: 1, fee: 1, rating: 1, isPublic: 1, slug: 1, hasPublishRequest: 1 }, sort:{ isPublic: -1 } } );
  },
  currentCourses: function () {
    var current = Current.find( { participants: Meteor.userId() }, { fields: { course: 1, courseTitle: 1, courseDate: 1 } } ).fetch();
    if ( current.length ) {
      for ( var i = 0; i < current.length; i++ ) {
        var courseId = current[i].course;
        var course = Courses.findOne( { _id: courseId }, { fields: { title: 1, rating: 1, slug: 1 } } );
        if ( ! course )
          continue; // stop here and continue with next iteration, might happen if course is offline or deleted
        delete course._id;
        _.extend( current[i], course );
      }
      return current;
    }
    else
      return false;
  },
  elapsedCourses: function () {
    var elapsed = Elapsed.find( { participants: Meteor.userId() }, { fields: { course: 1, courseTitle: 1, courseDate: 1 } } ).fetch();
    if ( elapsed.length ) {
      for ( var i = 0; i < elapsed.length; i++ ) {
        var courseId = elapsed[i].course;
        var course = Courses.findOne( { _id: courseId }, { fields: { title: 1, rating: 1, slug: 1 } } );
        if ( ! course )
          continue; // stop here and continue with next iteration, might happen if course is offline or deleted
        delete course._id;
        _.extend( elapsed[i], course );
      }
      return elapsed;
    }
    else
      return false;
  },
  myRating: function ( id ) {
    var elapsed = Elapsed.findOne( { _id: id }, { fields: { ratings: 1 } } );
    var myRating = _.find( elapsed.ratings, function ( item ) { return item.participant === Meteor.userId(); } );
    if ( myRating ) {
      Session.set( id, myRating.rating );
      return true;
    }
    else {
      Session.set( id, [0,0,0,0,0,0] );
      return false;
    }
  }
});

Template.userCourses.events({
  'click .rateCourse': function () {
    Session.set("rateId", this._id);
    var ratedValues = Session.get( this._id ); // [1,2,3,4,5,2]
    $('.rateitModal0').rateit('value', ratedValues[0]);
    $('.rateitModal1').rateit('value', ratedValues[1]);
    $('.rateitModal2').rateit('value', ratedValues[2]);
    $('.rateitModal3').rateit('value', ratedValues[3]);
    $('.rateitModal4').rateit('value', ratedValues[4]);
    $('.rateitModal5').rateit('value', ratedValues[5]);
    $('#ratingModal').modal('show');
  },
  'click .activate': function (event, template) {
    // from off to online
    if (confirm( "Möchten Sie Ihren Kurs jetzt freischalten lassen? Drücken Sie ok und wir prüfen Ihre Angaben. Wir lassen Sie wissen, sobald wir Ihren Kurs freigeschaltet haben." ) ) {
      var course = Courses.findOne({_id: this._id}, {fields:{_id:0, updatedAt:0}});
      var isValid = courseSchema.namedContext().validate(course);
      if (!isValid) {
        var invalidKeys = courseSchema.namedContext().invalidKeys();
        for (i=0; i<invalidKeys.length; i++) {
          var errTitle = invalidKeys[i].name,
              errMsg = courseSchema.namedContext().keyErrorMessage( errTitle );
          toastr.error( errMsg );
        }
        return false;
      }
      var options = {
        what: 'Kurs',
        itemId: this._id,
        itemName: this.title
      };
      Meteor.call('setCoursePublishRequest', options, function (error) {
        if (error) 
          toastr.error( error.reason );
        else {
          toastr.success( 'Danke, wir prüfen Ihren Kurs und schalten ihn frei.' );
        }
      });
    }

  },
  'click .deactivate': function (event, template) {
    if (confirm( "Möchten Sie Ihren Kurs wirklich deaktivieren?" ) ) {
      Meteor.call('unpublishCourse', this._id, function (error) {
        if (error) {
          toastr.error( error.reason );
        }
        else {
          toastr.success( 'Ihr Kurs wurde deaktiviert und ist nicht mehr öffentlich.' );
        }
      });
    }
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
    var ratedValue5 = parseFloat(template.find('#backing5').value);
    ratedValues = [ratedValue0, ratedValue1, ratedValue2, ratedValue3, ratedValue4, ratedValue5];

    modifier = { _id: Session.get("rateId"),
                ratedValues: ratedValues };
    Meteor.call('rateCourse', modifier, function ( error, result ) {
      if ( error )
        toastr.error( error.reason );
      else {
        toastr.success( 'Gespeichert.' );
        Session.set( "rateId", "" );
        $( '#ratingModal' ).modal( 'hide' );
      }
    });    
  }
});