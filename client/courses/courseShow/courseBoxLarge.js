Template.courseBoxLarge.rendered = function () {
  $('.rateit').rateit();
  $('[data-toggle="tooltip"]').tooltip(); //initialize all tooltips in this template
};

Template.courseBoxLarge.helpers({
  shareData: function () {
    var data = {
      // method: 'feed',
      title: this.title,
      description: this.description,
      // picture: this.imageId,
      // url: 'http://test.de'
      // url: 'http://traincrowdapp-46806.onmodulus.net/course/erstklassige-prasentationen'
      url: Meteor.absoluteUrl() + 'course/' + this.slug
    };
    return data;
  },
  trainerImageId: function (id) {
    var trainer = Meteor.users.findOne( {_id: id}, {fields: {"profile.imageId": 1}} );
    if (trainer.profile && trainer.profile.imageId)
      return trainer.profile.imageId;
    return false;
  },
  feePP: function () {
    return ( this.fee / this.maxParticipants ).toFixed(0);
  },
  percentFull: function () {
    var currents = Current.find( { course: this._id }, { sort: { courseDate: 1 }, limit: 1, fields: { participants: 1 } } ).fetch();
    return ( currents[0].participants.length / this.maxParticipants ).toFixed(1) * 100;
  },
  taxStatus: function () {
    return this.taxRate === 19 ? 'inkl. MwSt' : 'MwSt-befreit';
  },
  openSpots: function () {
    var currents = Current.find( { course: this._id }, { sort: { courseDate: 1 }, limit: 1, fields: { participants: 1 } } ).fetch();
    return this.maxParticipants - currents[0].participants.length;
  },
  eventConfirmed: function () {
    var currents = Current.find( { course: this._id }, { sort: { courseDate: 1 }, limit: 1, fields: { participants: 1, confirmed: 1 } } ).fetch();
    return currents[0].confirmed ? true : false;
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

Template.courseBoxLarge.events({
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  }
});
