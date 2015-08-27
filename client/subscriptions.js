// Meteor.subscribe('courses');
// Meteor.subscribe('bookings');
Meteor.subscribe('current');
Meteor.subscribe('elapsed');

Tracker.autorun( function() {
  if ( Meteor.userId() ) {
    Meteor.subscribe('userData');
  }
});

// Meteor.subscribe('userData');
Meteor.subscribe('trainer');
Meteor.subscribe('categories');