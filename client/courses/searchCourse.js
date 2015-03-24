Template.filter.helpers({
	categories: function () {
		return Categories.findOne().categories;
	}
});

Template.filter.events({
  'click .filter': function (event, template) {
    var category = event.target.id;
    // console.log(category);
    var instance = EasySearch.getComponentInstance(
      { index : 'courses' }
    );

    // Change the currently filteredCategories like this
    EasySearch.changeProperty('courses', 'filteredCategory', category);
    // Trigger the search again, to reload the new products
    instance.triggerSearch();
  },
  'click ul.nav.nav-pills li a': function (event) {
  	$(event.currentTarget).parent().addClass('active').siblings().removeClass('active');
  }
});

$(window).scroll(fixToTop);

function fixToTop() {
	if ($(window).scrollTop() > 20) {
    $('.courses-left-menu-wrapper').addClass("fixed");
  } else {
    $('.courses-left-menu-wrapper').removeClass("fixed");
  }
}