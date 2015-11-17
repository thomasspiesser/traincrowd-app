Template.progressbar.helpers({
  bookedOut( course, event ) {
    return event.participants.length === course.maxParticipants;
  },
  percentFull( course, event ) {
    return ( event.participants.length / course.maxParticipants )
      .toFixed(1) * 100;
  },
  // getWillTakePlaceTooltipText( course, event ) {
  //   return i18n('will.take.place.tooltip', openSpots( course, event ) );
  // },
  // getMightTakePlaceTooltipText( course, event ) {
  //   return i18n('might.take.place.tooltip', openSpots( course, event ) );
  // },
  // getOpenSeatsText( course, event ) {
  //   return i18n('open.seats', openSpots( course, event ) );
  // },
});

// function openSpots( course, event ) {
//   return course.maxParticipants - event.participants.length;
// }
