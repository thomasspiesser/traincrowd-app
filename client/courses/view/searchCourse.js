Template.searchCourse.onCreated( function() {
  this.subscribe( 'metaCategories', () => {
    $( '.tracker-slim' ).removeClass('active');
    let metaCategory = Router.current().params.query.metaCategory;
    let finder = metaCategory ? '#' + metaCategory.split(' ')[0] : '#Alle';
    Meteor.setTimeout(function() {
      $( finder ).parent().addClass('active');
    }, 200);
  });
  this.subscribe( 'categories' );
  this.subscribe( 'categoriesMap' );
});

let handle;

Template.searchCourse.onRendered( function() {
  handle = this.autorun( function() {
    let metaCategory = Router.current().params.query.metaCategory;
    Tracker.nonreactive( function() {
      _setFilter( metaCategory );
    });
  });
});

Template.searchCourse.onDestroyed( function() {
  handle.stop();
});

function _setFilter( metaCategory ) {
  if ( metaCategory ) {
    let categories = Router.current().params.query.filter.join();
    CoursesIndex.getComponentMethods().addProps( 'categories', categories );
  } else {
    CoursesIndex.getComponentMethods().addProps( 'categories', '' );
  }
  $( '.tracker-slim' ).removeClass('active');
  let finder = metaCategory ? '#' + metaCategory.split(' ')[0] : '#Alle';
  $( finder ).parent().addClass('active');
}

Template.searchCourse.helpers({
  metaCategories() {
    return MetaCategories.find();
  },
  getShortName() {
    return this.name.split(' ')[0];
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

Template.searchCourse.events({
  'click .filter'() {
    event.preventDefault();
    if ( !_.isEmpty( this ) ) {
      let categories = [];
      CategoriesMap.find( { metaCategoryId: this._id } )
        .forEach( function( match ) {
          categories.push( Categories.findOne({ _id: match.categoryId }).name );
        });
      let filter = {
        metaCategory: this.name,
        filter: categories,
      };
      Router.go( 'search.course', {}, { query: filter } );
    } else {
      Router.go( 'search.course' );
    }
  },
});
