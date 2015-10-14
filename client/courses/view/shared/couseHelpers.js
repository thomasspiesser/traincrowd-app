courseHelpers = {
  taxStatus: function () {
    return this.taxRate === 19 ? 'inkl. MwSt' : 'MwSt-befreit';
  },
  bookedOut: function ( course ) {
    return this.participants.length === course.maxParticipants;
  },
  percentFull: function ( course ) {
    return ( this.participants.length / course.maxParticipants ).toFixed(1) * 100;
  },
  getWillTakePlaceTooltipText: function ( course ) {
    return i18n('will.take.place.tooltip', openSpots( course, this ) );
  },
  getMightTakePlaceTooltipText: function ( course ) {
    return i18n('might.take.place.tooltip', openSpots( course, this ) );
  },
  getOpenSeatsText: function ( course ) {
    return i18n('open.seats', openSpots( course, this ) );
  },
};

var openSpots = function ( course, current ) {
  return course.maxParticipants - current.participants.length;
};