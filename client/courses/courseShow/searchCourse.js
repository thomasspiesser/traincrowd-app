Template.searchCourse.helpers({
  query: function () {
    return Router.current().params.query.q;
  },
  getPlaceholder: function () {
    return i18n('search.short');
  }
});

Template.filter.onCreated( function() {
  this.subscribe("categories");
});

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