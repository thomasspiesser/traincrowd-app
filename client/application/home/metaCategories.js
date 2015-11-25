Template.metaCategories.onCreated( function() {
  this.subscribe( 'metaCategories' );
  this.subscribe( 'categories' );
  this.subscribe( 'categoriesMap' );
});

Template.metaCategories.helpers({
  metaCategories( limit, skip ) {
    return _.map( MetaCategories.find({}, {
      limit: limit,
      skip: skip,
    }).fetch(), function( a, index ) {
      a._index = index + 1 + skip;
      return a;
    });
  },
});

Template.metaCategories.events({
  'click .meta-categorie'( event ) {
    event.preventDefault();
    let metaCategoryId = this._id;
    let metaCategory = this.name;
    // find all matching categories
    let categories = [];
    CategoriesMap.find( { metaCategoryId: metaCategoryId } )
      .forEach( function( match ) {
        categories.push( Categories.findOne( { _id: match.categoryId } ).name );
      });
    let filter = {
      metaCategory: metaCategory,
      filter: categories,
    };
    Router.go( 'search.course', {}, { query: filter } );
  },
});
