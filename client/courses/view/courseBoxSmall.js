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
