Template.shareprivate.onRendered( function () {
  // Use the shariff social sharing plugin
  var options = this.data.options;
  var buttonsContainer = $('.shariff');
  new Shariff(buttonsContainer, options);
});