Template.bookCourseThankYou.helpers({
	options: function () {
		var options = {
			services: ['facebook', 'twitter', 'linkedin'],
		};
		return options;
	},
	niceDate: function () {
    return moment(this).format("DD.MM.YYYY");
  },
});