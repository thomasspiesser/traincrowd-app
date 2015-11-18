// Template.trainerBox.rendered = function () {
//   $('.rateit').rateit();
// };

Template.trainerBox.helpers({
  shareData() {
    var data = {
      title: this.profile.name,
      description: this.profile.description,
      url: Meteor.absoluteUrl() + 'profile/' + this.slug,
    };
    return data;
  },
});

Template.trainerBox.events({
  'click .share-open'( event ) {
    $(event.currentTarget).next().toggleClass('in');
  },
});
