// All Courses -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Courses

Courses = new Meteor.Collection("courses");
/*
  Each course is represented by a document in the Courses collection:
    _id: course id
    owner: user id
    title, description: String
    maxParticipants: Integer
    rating: Float between 0 and 5
    public: Boolean
    pastParticipants: Array of user id's that have already taken this course
    comments: Array of objects like {user: userId, comment: "great course"} (or "lousy"/"some longer text")
*/

Inquired = new Meteor.Collection("inquired");
/*
  Each time a user inquires dates for a course to take place this is represented by a document in the Inquired collection:
    _id: inquired id
    owner: course owner user id
    course: course id
    inquirer: userId
    inquiredDates: [dates]
    createdAt: currentDate 
*/

Current = new Meteor.Collection("current");
/*
  Each current instance of a course is represented by a document in the Current collection:
    _id: inquired id // inherited from inquired _id if through inquired
    owner: course owner user id
    course: course id
    participants: [userIds]
    courseDate: date
*/

Elapsed = new Meteor.Collection("elapsed");
/*
  Each past course instance is represented by a document in the Elapsed collection:
    _id: inquired id // inherited from inquired _id if through inquired in any case through current _id
    owner: course owner user id
    course: course id
    participants: [userIds]
    courseDate: date
    ratings: [ {participant: userId, rating: 0-5} ]
*/

Courses.initEasySearch(['title', 'description'], {
    'limit' : 2
});

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

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

inquireNewCourseDates = function (options) {
  var id = Random.id();
  Meteor.call('inquireNewCourseDates', _.extend({ _id: id }, options));
  return id;
};

Meteor.methods({
  createCourse: function (title) {
    check(title, NonEmptyString);

    if (title.length > 2000)
      throw new Meteor.Error(413, "Titel zu lang");
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var id = Courses.insert({
      owner: this.userId,
      title: title
    });

    return id;
  },

  updateCourse: function (options) {
    // should check the content of modifier
    if (this.userId !== options.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");
    var modifier = _.omit(options, ['_id','owner']);
    Courses.update(options._id, { $set: modifier });
  },

  addParticipant: function (id) {
    // check that this.userId
    // check that this.userId is not already in participants

    Current.update(
      {_id: id},// {courseInstance: options.instanceId}, 
      {$push: { participants: this.userId }});
  },

  updateUser: function (user) {
    Meteor.users.update(Meteor.userId(), { $set: user });
  },

  rateCourse: function (options) {
    check(options.ratedValue, Number);
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein!");
    var elapsed = Elapsed.findOne({_id: options._id}, {fields: {course:1, participants:1, ratings:1, owner:1}});
    if (! elapsed)
      throw new Meteor.Error(404, "Nicht gefunden!");
    if (! _.contains(elapsed.participants,this.userId))
      throw new Meteor.Error(403, "Sie können nur Kurse bewerten, die Sie besucht haben.");

    var userId = this.userId;
    var ratedAlready = _.find(elapsed.ratings, function(item) { return item.participant === userId })
    if (ratedAlready) {
      ratedAlready.rating = options.ratedValue;
      Elapsed.update(options._id, { $set: { ratings: elapsed.ratings } });
    }
    else {
      Elapsed.update(options._id, { $push: { ratings: { participant: this.userId, rating: options.ratedValue } } });
    }
    // call func that updates the overall rating of this course
    var options = {course: elapsed.course, owner: elapsed.owner}
    Meteor.call('updateCourseRating', options );
  },
  updateCourseRating: function (options) {
    // get all elapsed for given course
    var elapsed = Elapsed.find( { course: options.course }, {fields: {ratings: 1}} ).fetch();
    var ratingArrays = _.map(elapsed, function(object) {return _.pluck(object.ratings, 'rating')} ) // [[1,2],[3,4]] non-flat
    var ratingScores = _.reduce(ratingArrays, function(a, b) { return a.concat(b); }, []) // flat
    var ratingSum = _.reduce(ratingScores, function(a, b){ return a + b; }, 0);
    var ratingCount = ratingScores.length;
    var avgRating = ratingSum / ratingCount;
    Courses.update(options.course, {$set: {rating: avgRating} });
    Meteor.call('updateTrainerRating', options );
  },
  updateTrainerRating: function (options) {
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
    Meteor.users.update(Meteor.userId(), {$set: {"profile.rating": avgRating} });
  },


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

  comment: function (courseId, comment) {
    check(courseId, String);
    check(comment, String);
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to comment");
    var course = Courses.findOne(courseId);
    if (! course)
      throw new Meteor.Error(404, "No such course");
    if (!_.contains(course.pastParticipants, this.userId))
      throw new Meteor.Error(403, "You can only comment on the course you took");

    var commentIndex = _.indexOf(_.pluck(course.comments, 'user'), this.userId);
    if (commentIndex !== -1) {
      // update existing comment entry

      if (Meteor.isServer) {
        // update the appropriate comment entry with $
        Courses.update(
          {_id: courseId, "comments.user": this.userId},
          {$set: {"comments.$.comment": comment}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["comments." + commentIndex + ".comment"] = comment;
        Courses.update(courseId, modifier);
      }

      // Possible improvement: send email to the other people that are
      // coming to the course.
    } else {
      // add new comment entry
      Courses.update(courseId,
                     {$push: {comments: {user: this.userId, comment: comment}}});
    }
  }
});

///////////////////////////////////////////////////////////////////////////////
// Users

// displayName = function (user) {
//   if (user.profile && user.profile.name)
//     return user.profile.name;
//   return user.emails[0].address;
// };

// var contactEmail = function (user) {
//   if (user.emails && user.emails.length)
//     return user.emails[0].address;
//   if (user.services && user.services.facebook && user.services.facebook.email)
//     return user.services.facebook.email;
//   return null;
// };
