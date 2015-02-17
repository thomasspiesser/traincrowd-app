Slingshot.createDirective("coursePicture", Slingshot.S3Storage, {
  // bucket: "traincrowd-images",

  acl: "public-read",

  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Sie müssen eingelogged sein!";
      throw new Meteor.Error(403, message);
    }

    return true;
  },

  key: function (file) {
    //Store file by the user's Id.
    //TODO make non-redundant names
    return this.userId + "_" + "course" + "_"+ file.name;
  }
});

Slingshot.createDirective("profilePicture", Slingshot.S3Storage, {
  // bucket: "traincrowd-images",

  acl: "public-read",

  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Sie müssen eingelogged sein!";
      throw new Meteor.Error(403, message);
    }

    return true;
  },

  key: function (file) {
    //Store file by the user's Id.
    return this.userId + "_" + "profile" + "_"+ file.name;
  }
});