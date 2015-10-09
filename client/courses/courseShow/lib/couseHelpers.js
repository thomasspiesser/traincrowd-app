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
  trainerImageId: function (id) {
    var trainer = Meteor.users.findOne( {_id: id}, {fields: {"profile.imageId": 1}} );
    if (trainer.profile && trainer.profile.imageId)
      return trainer.profile.imageId;
    return false;
  },
  openSpots: function ( course ) {
    return course.maxParticipants - this.participants.length;
  },
};