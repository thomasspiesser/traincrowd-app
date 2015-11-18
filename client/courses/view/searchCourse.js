Template.searchCourse.helpers({
  index() {
    return CoursesIndex;
  },
  inputAttributes() {
    let attrs = {
      class: 'form-control',
      placeholder: i18n('search.short'),
      value: Router.current().params.query.q,
    };
    return attrs;
  },
  loadMoreAttributes() {
    return { class: 'btn btn-light-blue btn-block margin-bottom' };
  },
});

Template.filter.onCreated( function() {
  this.subscribe( 'categories' );
});

Template.filter.helpers({
  categories() {
    return Categories.findOne().categories;
  },
});

Template.filter.events({
  'click .filter'( event ) {
    var category = event.target.id;
    // console.log(category);
    var instance = EasySearch.getComponentInstance({
      index: 'courses',
    });

    // Change the currently filteredCategories like this
    EasySearch.changeProperty('courses', 'filteredCategory', category);
    // Trigger the search again, to reload the new products
    instance.triggerSearch();
  },
  'click ul.nav.nav-pills li a'( event ) {
    $( event.currentTarget ).parent().addClass( 'active' )
      .siblings().removeClass( 'active' );
  },
});
