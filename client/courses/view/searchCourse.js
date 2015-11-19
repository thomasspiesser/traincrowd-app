Template.searchCourse.onCreated( function() {
  let metaCategory = Router.current().params.query.metaCategory
    || i18n('course.search');
  Session.set( 'metaCategory', metaCategory );
});

Template.searchCourse.helpers({
  getMetaCategory() {
    return Session.get( 'metaCategory' );
  },
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
  this.subscribe( 'metaCategories' );
  this.subscribe( 'categories' );
  this.subscribe( 'categoriesMap' );
});

Template.filter.helpers({
  metaCategories() {
    return MetaCategories.find();
  },
});

Template.filter.events({
  'click .filter'() {
    if ( !_.isEmpty( this ) ) {
      let metaCategoryName = this.name;
      let metaCategoryId = this._id;
      let categories = [];
      CategoriesMap.find( { metaCategoryId: metaCategoryId } )
        .forEach( function( match ) {
          categories.push( Categories.findOne( { _id: match.categoryId } ).name );
        });
      console.log(categories);
      CoursesIndex.getComponentMethods().addProps('categories', categories);
      Session.set( 'metaCategory', metaCategoryName );
    } else {
      CoursesIndex.getComponentMethods().addProps('categories', []);
      Session.set( 'metaCategory', i18n('course.search') );
    }
  },
  'click ul.nav.nav-pills li a'( event ) {
    $( event.currentTarget ).parent().addClass( 'active' )
      .siblings().removeClass( 'active' );
  },
});
