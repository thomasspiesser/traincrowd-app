Template.searchCourse.onCreated( function() {
  this.subscribe( 'metaCategories' );
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
  $( '.tracker-slim' ).removeClass('active');
  if ( metaCategory ) {
    let categories = Router.current().params.query.filter.join();
    CoursesIndex.getComponentMethods().addProps( 'categories', categories );
    Meteor.setTimeout(function() {
      $( '#' + metaCategory.split(' ')[0] ).parent().addClass('active');
    }, 200);
  } else {
    CoursesIndex.getComponentMethods().addProps( 'categories', '' );
    Meteor.setTimeout(function() {
      $( '#Alle' ).parent().addClass('active');
    }, 200);
  }
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

// Template.filter.onCreated( function() {
//   this.subscribe( 'metaCategories' );
//   this.subscribe( 'categories' );
//   this.subscribe( 'categoriesMap' );
// });

// Template.filter.helpers({
//   metaCategories() {
//     return MetaCategories.find();
//   },
// });

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
  // 'click ul.nav.nav-pills li a'( event ) {
  //   $( event.currentTarget ).parent().addClass( 'active' )
  //     .siblings().removeClass( 'active' );
  // },
});
