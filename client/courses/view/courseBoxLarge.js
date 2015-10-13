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
});

Template.courseBoxLarge.helpers(courseHelpers);

Template.courseBoxLarge.events({
  'click .share-open': function (event, template) {
    $(event.currentTarget).next().toggleClass('in');
  }
});
