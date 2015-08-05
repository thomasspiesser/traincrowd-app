Template.trainerBox.helpers({
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