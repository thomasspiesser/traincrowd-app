Template.shareprivate.onRendered(function () {
  // Use the shariff social sharing plugin
  var buttonsContainer = $('.shariff');
  new Shariff(buttonsContainer, {
      orientation: 'horizontal',
      services: ['facebook', 'twitter', 'googleplus', 'linkedin', 'pinterest', 'xing', 'whatsapp', 'mail']
  });
});