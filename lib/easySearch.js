EasySearch.createSearchIndex('courses', {
  'field' : ['title', 'description', 'categories', 'ownerName', 'city'],
  'collection' : Courses,
  'use' : 'minimongo',
  'limit': 50, 
  'props': {
    'filteredCategory' : 'Alle',
    'onlyShowPublic' : true
  },
  'sort': function () {
    return { 'hasDate': -1, 'dates': 1 };
    // return { 'rating': -1 };
    // return { 'dates': 1, 'rating': -1 };
  },
  'query' : function (searchString, opts) {
    // Default query that is used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    // this contains all the configuration specified above
    if (this.props.onlyShowPublic) {
      query.isPublic = true;
    }
    // filter for category if set
    if (this.props.filteredCategory !== 'Alle') {
      query.categories = this.props.filteredCategory;
    }
    // or more than 1 category: props.filteredCategories must be [] then!
    // if (this.props.filteredCategories.length > 0) {
    //   query.categories = { $in : this.props.filteredCategories };
    // }
    // console.log(query);
    return query;
  }
});

EasySearch.createSearchIndex('trainer', {
  'field' : ['profile.name'],
  'collection' : Meteor.users,
  'use' : 'minimongo',
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