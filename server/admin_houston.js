Houston.add_collection(Meteor.users);
Houston.add_collection(Houston._admins);
Houston.add_collection(Courses);
Houston.add_collection(Current);
Houston.add_collection(Elapsed);
Houston.add_collection(Bookings);
Houston.add_collection(Categories);
Houston.add_collection(MetaCategories);
Houston.add_collection(CategoriesMap);
Houston.add_collection(Bills);

Houston.methods( Courses, {
  Publish: function ( course ) {
    Courses.update(course._id, { $set: { isPublic: true, hasPublishRequest: false } }, { validate: false } );
    return "Der Kurs: '"+ course.title + "' ist jetzt online!";
  },
  Unpublish: function ( course ) {
    Courses.update(course._id, { $set: { isPublic: false } }, { validate: false } );
    return "Ok, der Kurs: '"+ course.title + "' ist offline.";
  }
});

Houston.methods( Meteor.users, {
  Publish: function ( user ) {
    Meteor.users.update(user._id, { $set: { isPublic: true, hasPublishRequest: false } }, { validate: false } );
    return "Das Profil von: '"+ user.profile.name + "' ist jetzt online!";
  },
  Unpublish: function ( user ) {
    Meteor.users.update(user._id, { $set: { isPublic: false } }, { validate: false } );
    return "Ok, das Profil von: '"+ user.profile.name + "' ist offline.";
  }
});

Houston.methods( Current, {
  Confirm: function ( current ) {
    Current.update( current._id, { $set: { confirmed: true } }, { validate: false } );
    return "Das Event am " + current.courseDate + " zum Kurs: '"+ current.title + "' findet statt!";
  },
  Unconfirm: function ( current ) {
    Current.update( current._id, { $set: { confirmed: false } }, { validate: false } );
    return "Ok, das Event am " + current.courseDate + " zum Kurs: '"+ current.title + "' findet nicht statt.";
  }
});