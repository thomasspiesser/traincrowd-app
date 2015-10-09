// Template.trainerBox.rendered = function () {
//   $('.rateit').rateit();
// };

Template.trainerBox.helpers({
  shareData: function () {
    var data = {
      title: this.profile.name,
      description: this.profile.description,
      url: Meteor.absoluteUrl() + 'profile/' + this._id
    };
    return data;
  },
  descriptionPreview: function () {
    if ( !this.profile.description ) {
      return 'Keine Kurzbeschreibung angegeben';
    }
    var descriptionPreview = this.profile.description.replace("\n", " "); // remove linebreaks
    var breaker = 110;
    if (descriptionPreview.length > breaker) {
      return descriptionPreview.slice(0, breaker) + "...";
    }
    else {
      return descriptionPreview;
    }
  }
});

Template.trainerBox.events({
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  }
});