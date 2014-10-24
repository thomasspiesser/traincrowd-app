// All Courses -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Courses

/*
  Each course is represented by a document in the Courses collection:
    owner: user id
    title, description: String
    maxParticipants: Integer
    rating: Float between 0 and 5
    public: Boolean
    pastParticipants: Array of user id's that have already taken this course
    comments: Array of objects like {user: userId, comment: "great course"} (or "lousy"/"some longer text")
*/
// Parties = new Mongo.Collection("parties");
Courses = new Meteor.Collection("courses");

Courses.allow({
  insert: function (userId, course) {
    return false; // no cowboy inserts -- use createCourse method
  },
  update: function (userId, course, fields, modifier) {
    if (userId !== course.owner)
      return false; // not the owner

    var allowed = ["title", "description", "maxParticipants", "public"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    return true;
  },
  remove: function (userId, course) {
    // You can only remove courses that you created
    return course.owner === userId;
  }
});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

createCourse = function (options) {
  var id = Random.id();
  Meteor.call('createCourse', _.extend({ _id: id }, options));
  return id;
};

Meteor.methods({
  // options should include: title, description, maxParticipants, public
  createCourse: function (options) {
    check(options, {
      title: NonEmptyString,
      description: NonEmptyString,
      maxParticipants: Number,
      public: Boolean,
      _id: Match.Optional(NonEmptyString)
    });

    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    var id = options._id || Random.id();
    Courses.insert({
      _id: id,
      owner: this.userId,
      maxParticipants: options.maxParticipants,
      title: options.title,
      description: options.description,
      public: !! options.public,
      rating: [],
      comments: []
    });
    return id;
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
