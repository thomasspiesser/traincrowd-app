

Inquired = new Mongo.Collection("inquired");
/*
  Each time a user inquires dates for a course to take place this is represented by a document in the Inquired collection:
    _id: inquired id
    owner: course owner user id
    course: course id
    inquirer: userId
    inquiredDates: [dates]
    createdAt: currentDate 
*/

Categories = new Mongo.Collection("categories");
/*
  all the categories are store in the Categories collection:
    _id: categories id
    categories: [kat1, kat2, kat3, etc]
*/

Transactions = new Mongo.Collection("transactions");
/*
  all the transactions are store in this collection:
*/

///////////////////////////////////////////////////////////////////////////////

EasySearch.createSearchIndex('courses', {
  'field' : ['title', 'description', 'categories', 'ownerName'],
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

///////////////////////////////////////////////////////////////////////////////

Meteor.users.deny({
  update: function () { return true; }
});

///////////////////////////////////////////////////////////////////////////////

Slingshot.fileRestrictions("coursePicture", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 5 * 1024 * 1024 // 10 MB (use null for unlimited)
});

Slingshot.fileRestrictions("profilePicture", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 5 * 1024 * 1024 // 10 MB (use null for unlimited)
});

///////////////////////////////////////////////////////////////////////////////

Meteor.methods({
  createCourse: function (title) {
    check(title, NonEmptyString);

    if (title.length > 120)
      throw new Meteor.Error(413, "Titel zu lang");
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var slug = slugify(title);
    // check that slug is unique
    if ( Courses.findOne( {slug: slug}, {fields: {_id:1}} ) ) {
      throw new Meteor.Error(423, "Ein Kurs mit diesem Titel existiert bereits. Bitte ändern Sie ihren Titel etwas ab.");
    }

    var user = Meteor.users.findOne( this.userId );
    var username = displayName(user);

    var doc = {
      owner: this.userId,
      ownerName: username,
      title: title,
      slug: slug
    };

    var id = Courses.insert(doc, {validate: false});

    return slug;
  },
  updateSingleCourseField: function (args) {
    check(args, {
      id: NonEmptyString,
      argName: String,
      argValue: Match.OneOf(String, Boolean, Number, [String])
    });

    if ( _.indexOf(allowedCourseFields, args.argName) === -1 )
      throw new Meteor.Error(403, "Das dürfen Sie nicht.");

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var course = Courses.findOne({_id: args.id}, {fields: {owner:1, title:1 }});
    
    if (! course || ! course.owner)
      throw new Meteor.Error(403, "Kurs nicht gefunden oder Kurs hat keinen Besitzer");
    
    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");
    
    var modifier =  {};
    modifier[args.argName] = args.argValue;

    if (args.argName === 'title' && args.argValue !== course.title) {
      var slug = slugify( args.argValue );
      if ( Courses.findOne( {slug: slug}, {fields: {_id:1}} ) )
        throw new Meteor.Error(423, "Ein Kurs mit diesem Titel existiert bereits. Bitte ändern Sie ihren Kurs-Title etwas ab.");

      // update all Current
      Current.update({course: args.id}, { $set: { courseTitle: args.argValue } }, { multi: true } );
      modifier = _.extend(modifier, {slug: slug});
    }

    Courses.update({_id: args.id}, { $set: modifier }, {validate: false});
  },
  updateSingleUserField: function (args) {
    check(args, {
      id: String,
      argName: String,
      argValue: String
    });

    if ( _.indexOf(allowedUserFields, args.argName) === -1 )
      throw new Meteor.Error(403, "Das dürfen Sie nicht.");

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    
    if ( args.argName === 'email' ) {
      if (! EMAIL_REGEX.test( args.argValue ))
        throw new Meteor.Error(403, "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben.");

      Meteor.users.update( { _id: this.userId }, { $set: { 'emails.0.address': args.argValue, 'emails.0.verified': false } } );
      return;
      // send verification email?
    }
    
    // if user changes name, then change also ownerName for all Courses
    if ( args.argName === 'name' ) {
      Courses.update( { owner: this.userId }, { $set: { ownerName: args.argValue } }, { multi: true } );
      // same for Currents
      Current.update( { owner: this.userId }, { $set: { ownerName: args.argValue } }, { multi: true } );
    }

    var modifier =  {};
    modifier['profile.'+args.argName] = args.argValue;

    if ( args.argName === 'videoURL' ) {
      var re = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
      var videoId = args.argValue.replace( re, '$1' );
      modifier = _.extend(modifier, {'profile.videoId': videoId});
    }
    
    Meteor.users.update( { _id: this.userId }, { $set: modifier } );
  },
  updateCategories: function (categories) {
    check(categories, [String]);
    Categories.upsert({}, { $addToSet: {categories: { $each: categories } } });
  },
  setProfilePublishRequest: function () {
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var trainer = Meteor.users.findOne({ _id: this.userId }, {fields: { 'profile.name': 1, isPublic: 1, hasPublishRequest: 1 }});

    if (trainer.isPublic)
      throw new Meteor.Error(425, "Profil ist bereits veröffentlicht");

    if (trainer.hasPublishRequest)
      throw new Meteor.Error(426, "Eine Anfrage zur Veröffentlichung wurde bereits gesendet");

    var options = {
      what: 'Trainerprofil',
      itemId: this.userId,
      itemName: trainer.profile.name
    };

    Meteor.call('sendRequestPublicationEmail', options, function (error) {
      if (error) 
        throw new Meteor.Error( error );
    });

    Meteor.users.update( {_id: this.userId }, { $set: { hasPublishRequest: true } });
  },
  setCoursePublishRequest: function (options) {
    check(options, {
      what: NonEmptyString,
      itemId: NonEmptyString,
      itemName: String
    });

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var course = Courses.findOne({_id: options.itemId}, {fields: {owner:1, isPublic:1, hasPublishRequest:1 }});

    if (!course || !course.owner)
      throw new Meteor.Error(404, "Kurs oder Trainer nicht gefunden");

    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    if (course.isPublic)
      throw new Meteor.Error(425, "Kurs ist bereits veröffentlicht");

    if (course.hasPublishRequest)
      throw new Meteor.Error(426, "Eine Anfrage zur Veröffentlichung wurde bereits gesendet");

    Meteor.call('sendRequestPublicationEmail', options, function (error) {
      if (error) 
        throw new Meteor.Error( error );
    });

    Courses.update( {_id: options.itemId}, { $set: { hasPublishRequest: true } });
  },
  unpublishProfile: function () {
    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var trainer = Meteor.users.findOne( { _id: this.userId }, { fields: { isPublic: 1 } } );

    if ( ! trainer.isPublic )
      throw new Meteor.Error(425, "Profil ist nicht öffentlich");

    Meteor.users.update( { _id: this.userId }, { $set: { isPublic: false } } );
    Courses.update( { owner: this.userId }, { $set: { isPublic: false } }, { multi: true } );
  },
  unpublishCourse: function (id) {
    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    check(id, NonEmptyString);

    var course = Courses.findOne( { _id: id }, { fields: { owner: 1, isPublic: 1 } } );

    if ( !course || !course.owner )
      throw new Meteor.Error(404, "Kurs oder Trainer nicht gefunden");

    if ( this.userId !== course.owner )
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");
    
    if ( !course.isPublic )
      throw new Meteor.Error(425, "Kurs ist nicht öffentlich");

    Courses.update( { _id: id }, { $set: { isPublic: false } } );
  },
  rateCourse: function (options) {
    check(options, {
      _id: String,
      ratedValues: [ Number ] 
    });

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");

    var elapsed = Elapsed.findOne({_id: options._id}, {fields: {course:1, participants:1, ratings:1, owner:1}});
    if (! elapsed)
      throw new Meteor.Error(404, "Vergangenes Event: " + options._id + " nicht gefunden!");
    if (! _.contains(elapsed.participants, this.userId))
      throw new Meteor.Error(403, "Sie können nur Kurse bewerten, die Sie besucht haben.");

    var userId = this.userId;
    var ratedAlready = _.find(elapsed.ratings, function(item) { return item.participant === userId; });
    if (ratedAlready) {
      ratedAlready.rating = options.ratedValues;
      Elapsed.update(options._id, { $set: { ratings: elapsed.ratings } });
    }
    else {
      Elapsed.update(options._id, { $push: { ratings: { participant: this.userId, rating: options.ratedValues } } });
    }
    // call func that updates the overall rating of this course
    options = {course: elapsed.course, owner: elapsed.owner};
    Meteor.call('updateCourseRating', options );
  },
  updateCourseRating: function (options) {
    check(options.course, String);
    // get all elapsed for given course
    var elapsed = Elapsed.find( { course: options.course }, {fields: {ratings: 1}} ).fetch();
    var ratingElapsedArrays = _.map(elapsed, function(object) {return _.pluck(object.ratings, 'rating'); } ); 
    // [ [ [ 3, 1, 3, 2, 5 ] ], [ [ 2, 4.5, 3, 3, 3 ], [ 5, 1.5, 2, 3, 1 ] ] ] non-flat
    var ratingArrays = _.flatten(ratingElapsedArrays, true); // shallow flatten = true: means one level deep
    // [ [ 3, 1, 3, 2, 5 ], [ 2, 4.5, 3, 3, 3 ], [ 5, 1.5, 2, 3, 1 ] ] flatter
    // now sort element-wise
    var ratingScores = _.zip.apply(_,ratingArrays);
    // [ [ 3, 2, 5 ],  [ 1, 4.5, 1.5 ],  [ 3, 3, 2 ],  [ 2, 3, 3 ],  [ 5, 3, 1 ] ]
    var ratingCount = ratingScores[0].length;
    var ratingSums = _.map(ratingScores, function (array) {return _.reduce(array, function(a, b){ return a + b; }, 0); } );
    // [10, 7, 8, 8, 9]
    // console.log(ratingSums)
    var avgsRatings = _.map(ratingSums, function(num){ return num / ratingCount; });
    // console.log(avgsRatings)
    // [3.33, 2.33, 2.66, 2.66, 3]
    var ratingSum = _.reduce(avgsRatings, function(a, b){ return a + b; }, 0);
    // console.log(ratingSum)
    var avgRating = ratingSum / avgsRatings.length;
    // console.log(avgRating)
    Courses.update(options.course, {$set: {rating: avgRating, ratingDetail: avgsRatings} });
    Meteor.call('updateTrainerRating', options );
  },
  updateTrainerRating: function (options) {
    check(options.owner, String);
    // get all courses for given owner = trainer
    // console.log(options)
    var courses = Courses.find( { owner: options.owner }, {fields: {rating: 1}} ).fetch();
    // console.log(courses)
    var ratings = _.pluck(courses, 'rating'); // zB. [undefined, 2.75, undefined, undefined]
    // console.log(ratings)
    ratings = _.compact(ratings); // remove falsy values
    // console.log(ratings)

    var ratingSum = _.reduce(ratings, function(a, b){ return a + b; }, 0);
    // console.log(ratingSum)
    var ratingCount = ratings.length;
    // console.log(ratingCount)
    var avgRating = ratingSum / ratingCount;
    // console.log(avgRating)
    Meteor.users.update(options.owner, {$set: {"profile.rating": avgRating} });
  }
});