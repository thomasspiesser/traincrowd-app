Template.courseBoxSmall.rendered = function () {
  // $('.rateit').rateit();
  $('[data-toggle="tooltip"]').tooltip(); //initialize all tooltips in this template
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

Template.courseBoxSmall.helpers(courseHelpers);

Template.courseBoxSmall.events({
  'click .btn-bar': function (event, template) {
    $(event.currentTarget).toggleClass('in');
  },
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  },
});
