courseHelpers = {
  taxStatus() {
    return this.taxRate === 19 ? 'inkl. MwSt' : 'MwSt-befreit';
  },
  bookedOut( course ) {
    return this.participants.length === course.maxParticipants;
  },
};
