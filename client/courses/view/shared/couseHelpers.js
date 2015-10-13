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
  openSpots: function ( course ) {
    return course.maxParticipants - this.participants.length;
  },
};