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
