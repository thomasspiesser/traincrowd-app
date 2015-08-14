Template.courseBoxSmall.rendered = function () {
  $('.rateit').rateit();
};

Template.courseBoxSmall.helpers({
	shareData: function () {
    var data = {
      title: this.title,
      description: this.description,
      url: Meteor.absoluteUrl() + 'course/' + this.slug
    };
    return data;
  },
  twocategories: function () {
    return _.first( this.categories, 2 );
  },
  trainerImageId: function (id) {
    var trainer = Meteor.users.findOne( {_id: id}, {fields: {"profile.imageId": 1}} );
    if (trainer.profile && trainer.profile.imageId)
      return trainer.profile.imageId;
    return false;
  },
  titlePreview: function () {
    if ( !this.title ) {
      return false;
    }
    var titlePreview = this.title.replace("\n", " "); // remove linebreaks
    var breaker = 37;
    if ( titlePreview.length > breaker ) {
      return titlePreview.slice(0, breaker) + "...";
    }
    else {
      return titlePreview;
    }
  },
  feePP: function () {
    var commision = calcCommision( this.fee );
    return ( ( this.fee + commision ) / this.maxParticipants ).toFixed(2);
  },
  percentFull: function () {
    var currents = Current.find( { course: this._id }, { sort: { courseDate: 1 }, limit: 1, fields: { participants: 1 } } ).fetch();
    return ( currents[0].participants.length / this.maxParticipants ).toFixed(1) * 100;
  },
  openSpots: function () {
    var currents = Current.find( { course: this._id }, { sort: { courseDate: 1 }, limit: 1, fields: { participants: 1 } } ).fetch();
    return this.maxParticipants - currents[0].participants.length;
  },
  eventConfirmed: function () {
    var currents = Current.find( { course: this._id }, { sort: { courseDate: 1 }, limit: 1, fields: { participants: 1, confirmed: 1 } } ).fetch();
    return currents[0].confirmed ? true : false;
  },
  nextEvent: function () {
    if (! this.dates || ! this.dates.length)
      return 'Kein Event';

    this.dates.sort( function (a,b) { return a[0] - b[0]; } ); // sort according to first event day
    var nextEvent = this.dates[0]; // we just want the next one

    if (nextEvent.length === 1) {
      return moment(nextEvent[0]).format("DD.MM.YYYY");
    }
    else { 
      return moment(_.first( nextEvent ) ).format("DD.MM") + ' - ' + moment(_.last( nextEvent ) ).format("DD.MM.YYYY");
    }
  }
});

Template.courseBoxSmall.events({
  'click .btn-bar': function (event, template) {
    $(event.currentTarget).toggleClass('in');
  },
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  },
});
