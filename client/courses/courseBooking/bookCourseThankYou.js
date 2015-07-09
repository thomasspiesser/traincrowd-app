Template.bookCourseThankYou.onRendered(function () {
  // Use the shariff social sharing plugin
  var buttonsContainer = $('.shariff');
  new Shariff(buttonsContainer, {
      orientation: 'horizontal'
  });
});

Template.bookCourseThankYou.helpers({
	foo: function () {
		// ...
	}
});