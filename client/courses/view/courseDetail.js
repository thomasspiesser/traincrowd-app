Template.courseDetail.rendered = function() {
  // $('.rateit').rateit();
  $('[data-toggle="tooltip"]').tooltip(); //initialize all tooltips in this template
};

Template.courseDetail.helpers({
  shareData: function () {
    var data = {
      title: this.title,
      description: this.description,
      url: Meteor.absoluteUrl() + 'course/' + this.slug
    };
    return data;
  },
  isPublic: function () {
    return this.isPublic;
  },
  getCurrent: function () {
    return Current.find( { course: this._id }, { sort:{ courseDate: 1 }, fields: { participants: 1, courseDate: 1, confirmed: 1 } } );
  },
  runtime: function ( course ) {
    var date = _.first( this.courseDate ); // first day of the event
    date = moment( date );
    if ( course.expires ) {
      // calc when the event expires: courseDate - no.of weeks before
      date.subtract( parseInt( course.expires ), 'weeks' );
    }
    var today = moment();
    return date.diff( today, 'days' );
  },
});

Template.courseDetail.helpers(courseHelpers);

Template.courseDetail.events({
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  },
  'click .joinCourseButton': function (event, template) {
    var current = this;
    var course = Template.parentData(1);
    if ( course.fee === 0 ) {
      Modal.show( 'noPayModal', current );
      return false;
    }
    else {
      Meteor.call('createBooking', current._id, course._id, function (error, result) {
        if ( error )
          toastr.error( error.reason );
        else
          Router.go('book.course', { _id: result } );
      });
    }
  }
});
