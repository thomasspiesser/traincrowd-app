Template.courseDetail.rendered = function() {
  $('.rateit').rateit();
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
  trainerImageId: function (id) {
    var trainer = Meteor.users.findOne( {_id: id}, {fields: {"profile.imageId": 1}} );
    if (trainer.profile && trainer.profile.imageId)
      return trainer.profile.imageId;
    return false;
  },
  getCurrent: function () {
    return Current.find( { course: this._id }, { sort:{ courseDate: 1 }, fields: { participants: 1, courseDate: 1, confirmed: 1 } } );
  },
  courseDateRange: function () {
    // context is current
    if (this.courseDate.length === 1)
      return moment(this.courseDate[0]).format("DD.MM.YYYY");
    if (this.courseDate.length > 1)
      return moment(_.first(this.courseDate) ).format("DD.MM") + ' - ' + moment(_.last(this.courseDate) ).format("DD.MM.YYYY");
  },
  feePP: function () {
    return ( this.fee / this.maxParticipants ).toFixed(0);
  },
  taxStatus: function () {
    return this.taxRate === 19 ? 'inkl. MwSt' : 'MwSt-befreit';
  },
  percentFull: function ( course ) {
    // data context is current, which is why function get par: course
    if (course.maxParticipants)
      return (this.participants.length / course.maxParticipants ).toFixed(1) * 100;
    return 0;
  },
  bookedOut: function ( course ) {
    return this.participants.length === course.maxParticipants;
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
  openSpots: function ( course ) {
    return course.maxParticipants - this.participants.length;
  }
});

Template.courseDetail.events({
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  },
  'click .joinCourseButton': function (event, template) {
    var current = this;
    var course = Template.parentData(1);
    Meteor.call('createBooking', current._id, course._id, function (error, result) {
      if ( error )
        toastr.error( error.reason );
      else
        Router.go('book.course', { _id: result } );
    });
    return false;
  }
});
