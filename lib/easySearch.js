CoursesIndex = new EasySearch.Index({
  collection: Courses,
  fields: ['title', 'description', 'categories', 'ownerName', 'city'],
  engine: new EasySearch.MongoDB({
    sort() {
      return { hasDate: -1, dates: 1 };
      // return { 'rating': -1 };
      // return { 'dates': 1, 'rating': -1 };
    },
    // fields() { // fields to publish
    //   let fields = {
    //     title: 1,
    //   };
    //   return fields;
    // },
    transform( doc ) {
      // this is a workaround so collection helpers work on client side, to be removed when fixed in package
      let transformedDoc = Courses._transform( doc );
      doc.canEdit = transformedDoc.canEdit();
      doc.getImage = transformedDoc.getImage();
      doc.getFeePP = transformedDoc.getFeePP();
      doc.getNextEvent = transformedDoc.getNextEvent();
      return doc;
    },
    selector( searchObject, options, aggregation ) {
      // Default query that is used for searching
      let selector = this.defaultConfiguration()
        .selector( searchObject, options, aggregation );

      let categoryFilter = options.search.props.categoryFilter;
      // console.log(categoryFilter);

      // filter for category if set
      if ( _.isString(categoryFilter) && !_.isEmpty(categoryFilter)
          && categoryFilter !== 'Alle') {
        selector.categories = categoryFilter;
      }

      // or more than 1 category: props.filteredCategories must be [] then!
      // if (this.props.filteredCategories.length > 0) {
      //   query.categories = { $in : this.props.filteredCategories };
      // }
      selector.isPublic = true;
      // console.log(selector);
      // console.log('searchObject');
      // console.log(searchObject);
      return selector;
    },
  }),
  defaultSearchOptions: {
    limit: 50,
  },
});

TrainersIndex = new EasySearch.Index({
  collection: Meteor.users,
  fields: ['profile.name'],
  engine: new EasySearch.Minimongo(),
  'limit': 80,
  'props': {
    'onlyShowTrainer' : true,
    'onlyShowPublic' : true
  },
  // 'changeResults': function (results) {
  //   // random sort the trainers
  //   results.results = _.shuffle( results.results );
  //   return results;
  // },
  'sort': function () {
    return { 'profile.name': -1 };
  },
  'query' : function (searchString, opts) {
    // Default query that is used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    // this contains all the configuration specified above
    if (this.props.onlyShowTrainer) {
      query.roles = 'trainer';
    }
    if (this.props.onlyShowPublic) {
      query.isPublic = true;
    }
    // Make the emails searchable
    query.$or.push({
      emails: {
        $elemMatch: {
          address: { '$regex' : '.*' + searchString + '.*', '$options' : 'i' }
        }
      }
    });
    return query;
  }
});