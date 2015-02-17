// All Courses -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Courses

Courses = new Mongo.Collection("courses");
/*
  Each course is represented by a document in the Courses collection:
    _id: course id
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

Images = new Mongo.Collection("images");
/*
  all the images be it course images or user images are store in the Images collection:
    _id: image id
    owner: image owner user id (courseId or userId)
    data: the image data
*/

Categories = new Mongo.Collection("categories");
/*
  all the categories are store in the Categories collection:
    _id: categories id
    categories: [kat1, kat2, kat3, etc]
*/

///////////////////////////////////////////////////////////////////////////////

// Courses.initEasySearch(['title', 'description'], {
//     'limit' : 2
// });

EasySearch.createSearchIndex('courses', {
  'field' : ['title', 'description', 'categories', 'ownerName'],
  'collection' : Courses,
  'use' : 'minimongo',
  'limit': 3, 
  'props': {
    'filteredCategory' : 'Alle',
    'onlyShowPublic' : true
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
    return query;
  }
});

///////////////////////////////////////////////////////////////////////////////

// Courses.allow({
//   insert: function (userId, course) {
//     return false;
//   },
//   update: function (userId, course, fields, modifier) {
//     if (userId !== course.owner)
//       return false; // not the owner

//     var allowed = ["title", "description", "maxParticipants"];
//     if (_.difference(fields, allowed).length)
//       return false; // tried to write to forbidden field

//     return true;
//   },
//   remove: function (userId, course) {
//     // You can only remove courses that you created
//     return course.owner === userId;
//   }
// });

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

    if (title.length > 2000)
      throw new Meteor.Error(413, "Titel zu lang");
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var user = Meteor.users.findOne( this.userId )
    var username = displayName(user);

    var id = Courses.insert({
      owner: this.userId,
      ownerName: username,
      title: title
    });

    return id;
  },

  updateCourse: function (options) {
    // should check the content of modifier
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    var course = Courses.findOne({_id: options._id}, {fields: {owner:1}});
    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");
    var modifier = _.omit(options, ['_id','owner']);
    Courses.update(options._id, { $set: modifier });
  },
  addToCourseDates: function (options) {
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    var course = Courses.findOne({_id: options._id}, {fields: {owner:1}});
    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");
    Courses.update(options._id, { $addToSet: {dates: { $each: options.dates } } });
  },
  updateImage: function (options) {
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    check(options._id, NonEmptyString);
    var image = Images.findOne({_id: options._id}, {fields: {data:0}});

    if (this.userId !== image.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Daten editieren");

    Images.update(options._id, {$set: {data: options.data}});
  },
  insertImage: function (data) {
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    var id = Images.insert({owner: this.userId,
                            data: data });
    return id;
  },
  removeImage: function (imageId) {
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    check(imageId, NonEmptyString);
    var image = Images.findOne({_id: imageId}, {fields: {data:0}});
    if (this.userId !== image.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Daten editieren");
    Images.remove({_id: imageId});
  },
  addParticipant: function (currentId) {
    check(currentId, String);
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    // check if event is already booked out / full
    var current = Current.findOne({_id: currentId}, { fields: { participants:1, course:1 } });
    var course = Courses.findOne({_id: current.course}, { fields: { minParticipants:1, maxParticipants:1} });
    var beforeBooking = current.participants.length
    var afterBooking = current.participants.length + 1

    if (beforeBooking < course.maxParticipants) {
      Current.update(
        {_id: currentId},
        {$push: { participants: this.userId }});

      Meteor.call('sendBookingConfirmationEmail', { course: course._id, userId: this.userId } );

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
  updateCategories: function (categories) {
    Categories.upsert({}, { $addToSet: {categories: { $each: categories } } });
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
    var ratedAlready = _.find(elapsed.ratings, function(item) { return item.participant === userId })
    if (ratedAlready) {
      ratedAlready.rating = options.ratedValues;
      Elapsed.update(options._id, { $set: { ratings: elapsed.ratings } });
    }
    else {
      Elapsed.update(options._id, { $push: { ratings: { participant: this.userId, rating: options.ratedValues } } });
    }
    // call func that updates the overall rating of this course
    var options = {course: elapsed.course, owner: elapsed.owner}
    Meteor.call('updateCourseRating', options );
  },
  updateCourseRating: function (options) {
    check(options.course, String);
    // get all elapsed for given course
    var elapsed = Elapsed.find( { course: options.course }, {fields: {ratings: 1}} ).fetch();
    var ratingElapsedArrays = _.map(elapsed, function(object) {return _.pluck(object.ratings, 'rating')} ) 
    // [ [ [ 3, 1, 3, 2, 5 ] ], [ [ 2, 4.5, 3, 3, 3 ], [ 5, 1.5, 2, 3, 1 ] ] ] non-flat
    var ratingArrays = _.flatten(ratingElapsedArrays, true) // shallow flatten = true: means one level deep
    // [ [ 3, 1, 3, 2, 5 ], [ 2, 4.5, 3, 3, 3 ], [ 5, 1.5, 2, 3, 1 ] ] flatter
    // now sort element-wise
    var ratingScores = _.zip.apply(_,ratingArrays)
    // [ [ 3, 2, 5 ],  [ 1, 4.5, 1.5 ],  [ 3, 3, 2 ],  [ 2, 3, 3 ],  [ 5, 3, 1 ] ]
    var ratingCount = ratingScores[0].length;
    var ratingSums = _.map(ratingScores, function (array) {return _.reduce(array, function(a, b){ return a + b; }, 0) } );
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
    var ratings = _.pluck(courses, 'rating') // zB. [undefined, 2.75, undefined, undefined]
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


//   invite: function (courseId, userId) {
//     check(courseId, String);
//     check(userId, String);
//     var course = Courses.findOne(courseId);
//     if (! course || course.owner !== this.userId)
//       throw new Meteor.Error(404, "No such course");
//     if (course.public)
//       throw new Meteor.Error(400,
//                              "That course is public. No need to invite people.");
//     if (userId !== course.owner && ! _.contains(course.invited, userId)) {
//       Courses.update(courseId, { $addToSet: { invited: userId } });

//       var from = contactEmail(Meteor.users.findOne(this.userId));
//       var to = contactEmail(Meteor.users.findOne(userId));
//       if (Meteor.isServer && to) {
//         // This code only runs on the server. If you didn't want clients
//         // to be able to see it, you could move it to a separate file.
//         Email.send({
//           from: "noreply@example.com",
//           to: to,
//           replyTo: from || undefined,
//           subject: "PARTY: " + course.title,
//           text:
// "Hey, I just invited you to '" + course.title + "' on All Tomorrow's Courses." +
// "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
//         });
//       }
//     }
//   },

  // comment: function (courseId, comment) {
  //   check(courseId, String);
  //   check(comment, String);
  //   if (! this.userId)
  //     throw new Meteor.Error(403, "You must be logged in to comment");
  //   var course = Courses.findOne(courseId);
  //   if (! course)
  //     throw new Meteor.Error(404, "No such course");
  //   if (!_.contains(course.pastParticipants, this.userId))
  //     throw new Meteor.Error(403, "You can only comment on the course you took");

  //   var commentIndex = _.indexOf(_.pluck(course.comments, 'user'), this.userId);
  //   if (commentIndex !== -1) {
  //     // update existing comment entry

  //     if (Meteor.isServer) {
  //       // update the appropriate comment entry with $
  //       Courses.update(
  //         {_id: courseId, "comments.user": this.userId},
  //         {$set: {"comments.$.comment": comment}});
  //     } else {
  //       // minimongo doesn't yet support $ in modifier. as a temporary
  //       // workaround, make a modifier that uses an index. this is
  //       // safe on the client since there's only one thread.
  //       var modifier = {$set: {}};
  //       modifier.$set["comments." + commentIndex + ".comment"] = comment;
  //       Courses.update(courseId, modifier);
  //     }

  //     // Possible improvement: send email to the other people that are
  //     // coming to the course.
  //   } else {
  //     // add new comment entry
  //     Courses.update(courseId,
  //                    {$push: {comments: {user: this.userId, comment: comment}}});
  //   }
  // }
});