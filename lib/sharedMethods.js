Meteor.methods({
  createCourse: function (title) {
    check(title, NonEmptyString);

    if (title.length > 120)
      throw new Meteor.Error(413, "Titel zu lang");
    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var slug = slugify(title);
    // check that slug is unique
    if ( Courses.findOne( {slug: slug}, {fields: {_id:1}} ) ) {
      throw new Meteor.Error(423, "Ein Kurs mit diesem Titel existiert bereits. Bitte ändern Sie ihren Titel etwas ab.");
    }

    var username = Meteor.users.findOne( this.userId ).getName();

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

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var course = Courses.findOne( { _id: args.id }, { fields: { owner: 1, title: 1 } } );
    
    if (! course || ! course.owner)
      throw new Meteor.Error(403, "Kurs nicht gefunden oder Kurs hat keinen Besitzer");
    
    if (this.userId !== course.owner)
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");
    
    var modifier =  {};
    modifier[args.argName] = args.argValue;

    // var isValid = courseSchema.namedContext().validateOne( modifier, args.argName, { modifier: false } );
    // if ( ! isValid ) 
    //   throw new Meteor.Error( courseSchema.namedContext().keyErrorMessage( args.argName ) );

    if ( args.argName === 'title' && args.argValue !== course.title ) {
      var slug = slugify( args.argValue );
      if ( Courses.findOne( { slug: slug }, { fields: { _id: 1 } } ) )
        throw new Meteor.Error(423, "Ein Kurs mit diesem Titel existiert bereits. Bitte ändern Sie ihren Kurs-Title etwas ab.");

      // update all Current
      Current.update( { course: args.id }, { $set: { courseTitle: args.argValue } }, { multi: true } );
      modifier = _.extend( modifier, { slug: slug } );
    }

    Courses.update({_id: args.id}, { $set: modifier } );
  },
  updateSingleUserField: function (args) {
    check(args, {
      id: Match.Optional(String),
      argName: String,
      argValue: Match.OneOf(String, Boolean)
    });

    if ( _.indexOf( allowedUserFields, args.argName ) === -1 )
      throw new Meteor.Error(403, "Das dürfen Sie nicht.");

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    
    if ( args.argName === 'email' ) {
      if (! EMAIL_REGEX.test( args.argValue ))
        throw new Meteor.Error(403, "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben.");

      Meteor.users.update( { _id: this.userId }, { $set: { 'emails.0.address': args.argValue, 'emails.0.verified': false } } );
      return;
      // send verification email?
    }
    
    var modifier =  {};
    // if user changes name, then change slug and also ownerName for all Courses
    if ( args.argName === 'name' ) {
      // should check if slug already exists and add a number or so...
      let slug = slugify(args.argValue);
      modifier.slug = slug;
      Courses.update( { owner: this.userId }, { $set: { ownerName: args.argValue } }, { multi: true } );
      // same for Currents
      Current.update( { owner: this.userId }, { $set: { ownerName: args.argValue } }, { multi: true } );
    }

    if ( _.indexOf( addressSchema.objectKeys() , args.argName ) !== -1 ) {
      var selectedBillingAddress = Meteor.user().profile.selectedBillingAddress || 0;
      // Vorsicht, wenn billingAddresses nicht als [] initialisiert ist, wird ein {} drauss, kein []
      modifier[ 'profile.billingAddresses.'+ selectedBillingAddress + '.' + args.argName ] = args.argValue;
    }
    else {
      modifier[ 'profile.' + args.argName ] = args.argValue;
    }

    // var isValid = userSchema.namedContext().validateOne( modifier, args.argName, { modifier: false } );
    // if ( ! isValid ) 
    //   throw new Meteor.Error( userSchema.namedContext().keyErrorMessage( args.argName ) );

    if ( args.argName === 'videoURL' ) {
      var re = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
      var videoId = args.argValue.replace( re, '$1' );
      modifier = _.extend(modifier, {'profile.videoId': videoId});
    }
    console.log(modifier);
    Meteor.users.update( { _id: this.userId }, { $set: modifier } );
  },
  updateSelectedBillingAddress: function (arg) {
    check(arg, Number);

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");
    
    Meteor.users.update( { _id: this.userId }, { $set: { 'profile.selectedBillingAddress': arg } } );
  },
  createBooking: function (currentId, courseId) {
    check(currentId, NonEmptyString);
    check(courseId, NonEmptyString);

    var fields = { course: 1, courseDate: 1 };
    var current = Current.findOne( { _id: currentId }, { fields: fields } );
    checkExistance( current, "Event", fields );

    if ( current.course !== courseId)
      throw new Meteor.Error(403, "Kurs-Id von Event und Kurs-Id stimmen nicht überein.");

    fields = { title: 1, fee: 1, owner: 1, ownerName: 1, maxParticipants: 1 };
    var course = Courses.findOne( { _id: courseId }, { fields: fields } );
    checkExistance( course, "Kurs", fields );

    var courseFeePP = +( course.fee / course.maxParticipants ).toFixed(0);
      
    var doc = {
      trainer: course.owner,
      trainerName: course.ownerName,
      course: course._id,
      courseTitle: course.title,
      courseFeePP: courseFeePP,
      eventId: current._id,
      eventDate: current.courseDate
    };

    if ( this.userId ) {
      doc.customer = this.userId;
      doc.customerName = Meteor.users.findOne( this.userId ).getName();
    }

    var id = Bookings.insert( doc, { validate: false } );

    return id;
  },
  updateBooking: function ( args ) {
    check(args, {
      bookingId: NonEmptyString,
      argName: String,
      argValue: String
    });

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var booking = Bookings.findOne( { _id: args.bookingId }, { fields: { customer: 1, bookingStatus: 1 } } );
    
    if ( ! booking )
      throw new Meteor.Error(403, "Buchung nicht gefunden");

    if ( booking.bookingStatus !== 'inProgress' ) 
      throw new Meteor.Error(403, "Buchung ist bereits abgeschlossen");

    if ( booking.customer && booking.customer !== this.userId )
      throw new Meteor.Error(403, "Diese Buchung gehört zu einem anderen Kunden. Bitte starten Sie den Buchungsprozess von vorne.");

    var modifier = {};
    var user = Meteor.users.findOne( this.userId );
    var username = user.getName();
    
    if ( args.argName === 'customer' ) {
      // try to create the customer field. this field should not be updated
      modifier.customer = this.userId;
      modifier.customerName = username;
    }

    if ( args.argName === 'billingAddress' ) {
      // if someone used 'Anmelden' instead of our two forms, create customer now.
      if ( ! booking.customer ) {
        modifier.customer = this.userId;
        modifier.customerName = username;
      }

      if ( ! user.profile || ! user.profile.billingAddresses )
        throw new Meteor.Error(403, "Rechnungsadresse nicht gefunden");

      var selectedBillingAddress = user.profile.selectedBillingAddress || 0;
      var billingAddress = user.profile.billingAddresses[ selectedBillingAddress ];

      if ( ! billingAddress )
        throw new Meteor.Error(403, "Rechnungsadresse nicht gefunden");
      
      modifier.billingAddress = billingAddress;
    }

    if ( args.argName === 'paymentMethod' ) {
      var paymentMethod = args.argValue;
      modifier.paymentMethod = paymentMethod;
    }

    Bookings.update( { _id: args.bookingId }, { $set: modifier } );
  },
  setHasShared: function ( bookingId ) {
    check( bookingId, NonEmptyString );

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var booking = Bookings.findOne( { _id: bookingId }, { fields: { customer: 1, hasShared: 1 } } );

    if ( booking.hasShared )
      throw new Meteor.Error(403, "Seite wurde bereits geteilt");

    if ( booking.customer !== this.userId )
      throw new Meteor.Error(403, "Sie dürfen nur Ihre eigene Buchung bearbeiten");

    Bookings.update( { _id: bookingId }, { $set: { hasShared: true } } );
  },
  setProfilePublishRequest: function () {
    if ( ! this.userId )
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

    Meteor.users.update( { _id: this.userId }, { $set: { hasPublishRequest: true } } );

    Meteor.call( 'sendRequestPublicationEmail', options, function ( error, result ) {
      if ( error )
        console.log( error );
    });
  },
  setCoursePublishRequest: function (options) {
    check( options, {
      what: NonEmptyString,
      itemId: NonEmptyString,
      itemName: String
    });

    if ( ! this.userId )
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var course = Courses.findOne( { _id: options.itemId }, { fields: { owner: 1, isPublic: 1, hasPublishRequest: 1 } } );

    if ( ! course || ! course.owner )
      throw new Meteor.Error(404, "Kurs oder Trainer nicht gefunden");

    if ( this.userId !== course.owner )
      throw new Meteor.Error(403, "Sie können nur Ihre eigenen Kurse editieren");

    if ( course.isPublic )
      throw new Meteor.Error(425, "Kurs ist bereits veröffentlicht");

    if ( course.hasPublishRequest )
      throw new Meteor.Error(426, "Eine Anfrage zur Veröffentlichung wurde bereits gesendet");

    Courses.update( { _id: options.itemId }, { $set: { hasPublishRequest: true } } );

    Meteor.call( 'sendRequestPublicationEmail', options, function ( error, result ) {
      if ( error ) 
        console.log( error );
    });
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
});