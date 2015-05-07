// All Courses -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Courses

Courses = new Mongo.Collection("courses");
/*
  Each course is represented by a document in the Courses collection:
    _id: course id
    slug: URL slug from title
    owner: user id
    title, description: String
    maxParticipants: Integer
    rating: Float between 0 and 5
    public: Boolean
*/

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

Current = new Mongo.Collection("current");
/*
  Each current instance of a course is represented by a document in the Current collection:
    _id: inquired id // inherited from inquired _id if through inquired
    owner: course owner user id
    course: course id
    participants: [userIds]
    courseDate: date
*/

Elapsed = new Mongo.Collection("elapsed");
/*
  Each past course instance is represented by a document in the Elapsed collection:
    _id: inquired id // inherited from inquired _id if through inquired in any case through current _id
    owner: course owner user id
    course: course id
    participants: [userIds]
    courseDate: date
    ratings: [ {participant: userId, rating: 0-5} ]
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
  'limit': 5, 
  'props': {
    'filteredCategory' : 'Alle',
    'onlyShowPublic' : true
  },
  'sort': function () {
    return { 'rating': -1 };
    // return { 'dates': 1, 'rating': -1 };
  },
  'query' : function (searchString, opts) {
    // Default query that is used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    // this contains all the configuration specified above
    if (this.props.onlyShowPublic) {
      query.public = true;
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
  'limit': 8, 
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
      query.public = true;
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
      throw new Meteor.Error(423, "Ein Kurs mit diesem Titel existiert bereits. Bitte ändern Sie ihren Kurs-Title etwas ab.");
    }

    var user = Meteor.users.findOne( this.userId );
    var username = displayName(user);

    var id = Courses.insert({
      owner: this.userId,
      ownerName: username,
      title: title,
      slug: slug
    });

    return slug;
  },
  updateCourseSingleField: function (args) {
    check(args.id, NonEmptyString);
    check(args.argName, String);
    if ( _.indexOf(allowedFields, args.argName) === -1 ) {
      throw new Meteor.Error(403, "Das dürfen Sie nicht.");
    }
    check(args.argValue, Match.OneOf(String, Boolean, Number, [String]) );

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
      if ( Courses.findOne( {slug: slug}, {fields: {_id:1}} ) ) {
        throw new Meteor.Error(423, "Ein Kurs mit diesem Titel existiert bereits. Bitte ändern Sie ihren Kurs-Title etwas ab.");
      }
      modifier = _.extend(modifier, {slug: slug});
    }

    Courses.update({_id: args.id}, { $set: modifier });
  },
  updateCategories: function (categories) {
    check(categories, [String]);
    Categories.upsert({}, { $addToSet: {categories: { $each: categories } } });
  },
  updateCourse: function (options) {
    // should check the content of modifier
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    var course = Courses.findOne({_id: options._id}, {fields: {owner:1, title:1}});
    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    if (options.title && options.title !== course.title) {
      var slug = slugify(options.title);
      if ( Courses.findOne( {slug: slug}, {fields: {_id:1}} ) ) {
        throw new Meteor.Error(423, "Ein Kurs mit diesem Titel existiert bereits. Bitte ändern Sie ihren Kurs-Title etwas ab.");
      }
      options = _.extend(options, {slug: slug});
    }

    var modifier = _.omit(options, ['_id','owner']);
    Courses.update(options._id, { $set: modifier });
  },
  addParticipant: function (currentId) {
    check(currentId, String);
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    // check if event is already booked out / full
    var current = Current.findOne({_id: currentId}, { fields: { participants:1, course:1 } });
    var course = Courses.findOne({_id: current.course}, { fields: { minParticipants:1, maxParticipants:1} });
    var beforeBooking = current.participants.length;
    var afterBooking = current.participants.length + 1;

    if (beforeBooking < course.maxParticipants) {
      Current.update(
        {_id: currentId},
        {$push: { participants: this.userId }});

      Meteor.call('sendBookingConfirmationEmail', { course: course._id } );

      if (afterBooking === course.maxParticipants) {
        // generate token to confirm the event 
        var token = Random.hexString(64); 
        // save in current
        Current.update(
          {_id: currentId},
          {$set: { token: token }});
        // inform trainer (owner) that current event is full so that he can confirm the event
        Meteor.call('sendCourseFullTrainerEmail', {currentId: currentId, course: course._id, token: token } );
      }
    }
    else {
      throw new Meteor.Error("Event ist schon ausgebucht!");
    }
  },
  setPublishRequest: function (options) {
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    
    check(options, {
      what: NonEmptyString,
      itemId: NonEmptyString,
      itemName: String
    });

    var course = Courses.findOne({_id: options.itemId}, {fields: {owner:1, public:1, publishRequest:1 }});

    if (!course || !course.owner)
      throw new Meteor.Error(404, "Kurs oder Trainer nicht gefunden");
    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");
    if (course.public)
      throw new Meteor.Error(425, "Kurs ist bereits veröffentlicht");
    if (course.publishRequest)
      throw new Meteor.Error(426, "Eine Anfrage zur Veröffentlichung wurde bereits gesendet");

    Meteor.call('sendRequestPublicationEmail', options, function (error) {
      if (error) 
        throw new Meteor.Error( error );
    });

    Courses.update({_id: options.itemId}, {$set: {publishRequest: true}});
  },
  unpublish: function (id) {
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    check(id, NonEmptyString);

    var course = Courses.findOne({_id: id}, {fields: {owner:1, public:1 }});

    if (!course || !course.owner)
      throw new Meteor.Error(404, "Kurs oder Trainer nicht gefunden");
    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");
    if (!course.public)
      throw new Meteor.Error(425, "Kurs ist nicht öffentlich");

    Courses.update( {_id: id}, {$set: {public: false}} );
  },
  updateUser: function (options) {
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    if (options.email) {
      check(options.email, String); // here nochmal regex?!
      Meteor.users.update(this.userId, { $set: { 'emails.0.address': options.email, 'emails.0.verified': false } } );
      // send verification email
    }
    // if user changes name, then change also ownerName for all Courses
    if (options['profile.name']) {
      check(options['profile.name'], String);
      Courses.update({owner: this.userId}, { $set: { ownerName: options['profile.name'] } },
   { multi: true } );
    }
    Meteor.users.update(this.userId, { $set: options });
  },

  rateCourse: function (options) {
    check(options, {
      _id: String,
      ratedValues: [Number] 
    });

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");

    var elapsed = Elapsed.findOne({_id: options._id}, {fields: {course:1, participants:1, ratings:1, owner:1}});
    if (! elapsed)
      throw new Meteor.Error(404, "Vergangenes Event: " + options._id + "nicht gefunden!");
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