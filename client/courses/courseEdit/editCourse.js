Template.editCourse.created = function () {
  Session.set("editCourseTemplate", "editCourseDescription");
};

Template.editCourse.helpers({
  deservesCheckCourseDescription: function () {
    return this.title && this.description && this.categories && this.categories.length ? true : false;
  },
  deservesCheckCourseDetails: function () {
    return this.aims ? true : false;
  },
  deservesCheckCourseCosts: function () {
    return this.maxParticipants && this.fee !== null ? true : false;
  },
  deservesCheckCourseDates: function () {
    return this.dates && this.dates.length ? true : false;
  },
  deservesCheckCourseLogistics: function () {
    return this.noLocation || this.street ? true : false;
  },
  active: function() {
    return Session.get('editCourseTemplate');
  }
});

Template.editCourse.events({ 
  'click .dynamic-template-selector': function ( event ) {
    Session.set( 'editCourseTemplate', event.currentTarget.id );

    $( '.dynamic-template-selector' ).parent().removeClass('active');
    $( event.currentTarget ).parent().addClass('active');
  }
});