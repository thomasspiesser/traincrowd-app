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
