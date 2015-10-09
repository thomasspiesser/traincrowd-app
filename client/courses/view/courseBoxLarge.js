Template.courseBoxLarge.rendered = function () {
  // $('.rateit').rateit();
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
  getCurrent: function () {
    var self = this;
    var currents = Current.find( { course: this._id }, { sort: { courseDate: 1 }, fields: { participants: 1, confirmed: 1 } } ).fetch();
    var current = _.find( currents, function ( current ) {
      return current.participants.length !== self.maxParticipants;
    });
    if ( current )
      return current;
    else
      return currents[0];
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
      return 'aktuell kein Termin';

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

Template.courseBoxLarge.helpers(courseHelpers);

Template.courseBoxLarge.events({
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  }
});
