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
      doc.getOwnerSlug = transformedDoc.getOwnerSlug();
      doc.getNextEvent = transformedDoc.getNextEvent();
      return doc;
    },
    selector( searchObject, options, aggregation ) {
      // Default query that is used for searching
      let selector = this.defaultConfiguration()
        .selector( searchObject, options, aggregation );
      console.log(options.search);
      let categories = options.search.props.categories;
      console.log('categories:');
      console.log(categories);

      // filter for category if set
      // if ( _.isString(categories) && !_.isEmpty(categories)
      //     && categories !== 'Alle') {
      //   selector.categories = categories;
      // }

      // filter for multiple categories if set
      if ( _.isArray(categories) && !_.isEmpty(categories) &&
          _.isString(categories[0]) ) {
        selector.categories = { $in: categories };
      }

      selector.isPublic = true;
      console.log('selector:');
      console.log(selector);
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
  fields: [ 'profile.name' ],
  engine: new EasySearch.MongoDB({
    sort() {
      return { 'profile.name': -1 };
    },
    fields() {
      let fields = {
        services: 0,
        createdAt: 0,
        updatedAt: 0,
        emails: 0,
        hasPublishRequest: 0,
        token: 0,
        'profile.billingAddresses': 0,
        'profile.selectedBillingAddress': 0,
        'profile.taxNumber': 0,
        'profile.employer': 0,
        'profile.position': 0,
        'profile.industry': 0,
        'profile.workExperience': 0,
        'profile.newsletter': 0,
        'profile.phone': 0,
        'profile.mobile': 0,
      };
      return fields;
    },
    transform( doc ) {
      // this is a workaround so collection helpers work on client side, to be removed when fixed in package
      let transformedDoc = Meteor.users._transform( doc );
      doc.canEdit = transformedDoc.canEdit();
      doc.getName = transformedDoc.getName();
      return doc;
    },
    selector( searchObject, options, aggregation ) {
      // Default query that is used for searching
      let selector = this.defaultConfiguration()
        .selector( searchObject, options, aggregation );

      // only show public:
      selector.isPublic = true;
      // only show trainer:
      selector.roles = 'trainer';
      return selector;
    },
  }),
  defaultSearchOptions: {
    limit: 80,
  },
});
