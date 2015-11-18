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
    let category = event.target.id;
    // console.log(category);
    CoursesIndex.getComponentMethods().addProps('categories', category);
  },
  'click ul.nav.nav-pills li a'( event ) {
    $( event.currentTarget ).parent().addClass( 'active' )
      .siblings().removeClass( 'active' );
  },
});
