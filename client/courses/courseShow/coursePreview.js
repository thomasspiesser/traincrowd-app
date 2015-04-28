Template.coursePreview.rendered = function () {
  $('.rateit').rateit();
};

Template.coursePreview.helpers({
  trainerImageId: function (id) {
    var trainer = Meteor.users.findOne( {_id: id}, {fields: {"profile.imageId": 1}} );
    if (trainer.profile && trainer.profile.imageId)
      return trainer.profile.imageId;
    return false;
  },
  feePP: function () {
    var commision = +( this.fee / 100 * 15 ).toFixed(2);
    return ( ( this.fee + commision ) / this.maxParticipants ).toFixed(2);
  },
  titlePreview: function () {
    if ( !this.title ) {
      return false;
    }
    var titlePreview = this.title.replace("\n", " "); // remove linebreaks
    var breaker = 95;
    if ( titlePreview.length > breaker ) {
      return titlePreview.slice(0, breaker) + "...";
    }
    else {
      return titlePreview;
    }
  },
  descriptionPreview: function () {
    if ( !this.description ) {
      return false;
    }
    var descriptionPreview = this.description.replace("\n", " "); // remove linebreaks
    var breaker = 200;
    if (descriptionPreview.length > breaker) {
      return descriptionPreview.slice(0, breaker) + "...";
    }
    else {
      return descriptionPreview;
    }
  },
  nextEvent: function () {
    this.dates.sort( function (a,b) { return a[0] - b[0]; } ); // sort according to first event day
    var nextEvent = this.dates[0]; // we just want the next one

    if (nextEvent && nextEvent.length) {
      if (nextEvent.length === 1) {
        return moment(nextEvent[0]).format("DD.MM.YYYY");
      }
      return moment(_.first( nextEvent ) ).format("DD.MM") + ' - ' + moment(_.last( nextEvent ) ).format("DD.MM.YYYY");
    }
    return 'Kein Event';
  }
});