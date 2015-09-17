var secret = Meteor.settings.paymill.livePrivateKey;
paymill = paymill(secret);

Meteor.methods({
  createTransaction: function ( options ) {
    check(options, {
      token: NonEmptyString,
      amount: Number,
      bookingId: NonEmptyString,
      seats: Number,
      additionalParticipants: [ String ] // the array of emails for the other participants
    });
    
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var seats = parseInt(options.seats);
    if ( seats < 1 )
      throw new Meteor.Error(403, "Anzahl der Kursplätze muss größer gleich 1 sein.");

    if ( seats !== options.additionalParticipants.length + 1 )
      throw new Meteor.Error(403, "Anzahl an Emails und Kursplätze stimmen nicht überein.");

    var fields = { eventId: 1, course: 1, courseFeePP: 1 };
    var booking = Bookings.findOne( { _id: options.bookingId }, { fields: fields } );
    checkExistance( booking, "Buchung", fields );

    if ( options.amount !== booking.courseFeePP * seats ) 
      throw new Meteor.Error(403, "Bezahlbetrag und Kurspreis für " + seats + " Person(en) stimmen nicht überein");

    var currentId = booking.eventId;
    var courseId = booking.course;

    fields = { participants: 1 };
    var current = Current.findOne( { _id: currentId }, { fields: fields } );
    checkExistance( current, "Event", fields );

    fields = { maxParticipants: 1, title: 1 };
    var course = Courses.findOne( { _id: courseId }, { fields: fields } );
    checkExistance( course, "Kurs", fields );

    var afterBooking = current.participants.length + seats;

    // check if there are enough seats available
    if ( afterBooking <= course.maxParticipants ) {
      // good, there are enough seats available in this course
      // here i need to add the participants to block the course-seats already for time of payment and remove the participants again if payment is no good ( error ) to unblock seats (let others book them)
      var newParticipants = [ this.userId ];
      // register the other ones if there are any
      if ( seats > 1 ) {
        // create new users
        for ( var i = seats - 2; i >= 0; i-- ) {
          newParticipants.push( createUserWoPassword( options.additionalParticipants[i] ) );
        } 
      }

      // add them to current.participants
      Current.update( { _id: currentId }, { $push: { participants: { $each: newParticipants } } } );

      // synchronous paymill call
      var paymillCreateTransactionSync = Meteor.wrapAsync(paymill.transactions.create);

      try {

        var user = Meteor.users.findOne( this.userId );

        var result = paymillCreateTransactionSync({
          amount      : options.amount,
          currency    : 'EUR',
          token       : options.token,
          description : 'user: ' + this.userId + ' ' + displayName( user ) + '; booking: ' + booking._id
        });

        // update booking
        var modifier = {
          transaction     :  result.data.id,
          transactionDate :  new Date(result.data.created_at * 1000), // unix timestamp is in sec, need millisec, hence * 1000
          amount          :  result.data.amount / 100,
          bookingStatus   :  'completed',
          seats           :  seats
        };

        // non-blocking coz with callback, also error doesnt invoke catch, which is good coz money is with us
        Bookings.update( { _id: booking._id }, { $set: modifier }, function ( error, result ) {
          if ( error ) {
            console.log( error );
            console.log( 'modifier: ' + modifier );
            console.log( 'booking-id: ' + booking._id );
            console.log( 'event-id: ' + currentId );
            console.log( 'user-id: ' + this.userId );
          }
        });

        // inform participants via email
        for ( var i = newParticipants.length - 1; i >= 0; i-- ) {
          sendBookingConfirmationEmail( { course: course._id, userId: newParticipants[i] } );
        }

        // check if course is full now:
        if ( afterBooking === course.maxParticipants ) {
          // generate token for trainer to confirm the event 
          var token = Random.hexString(64); 
          // save in current
          Current.update( { _id : currentId }, { $set: { token: token } }, function ( error, result ) {
            if ( error ) {
              console.log( error );
            }
            else {
              // inform trainer (owner) that current event is full so that he can confirm the event
              Meteor.call('sendCourseFullTrainerEmail', { currentId: currentId, course: course._id, token: token }, function ( error, result ) {
                if ( error ) {
                  console.log( error );
                }
              });
            }
          });
        }
        return result;
      }
      catch( error ){
        console.log( error );
        // remove Participant again - coz payment failed - careful this operation will pull ALL participants with this Id from the list
        Current.update( { _id: currentId }, { $pull: { participants: { $each: newParticipants } } } );
        throw new Meteor.Error( error.message );
      }
    }
    else {
      throw new Meteor.Error("Event ist leider mittlerweile schon ausgebucht!");
    } 
  },
  createInvoice: function ( options ) {
    check(options, {
      bookingId: NonEmptyString,
      seats: Number,
      additionalParticipants: [ String ] // the array of emails for the other participants
    });
    
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var seats = parseInt(options.seats);
    if ( seats < 1 )
      throw new Meteor.Error(403, "Anzahl der Kursplätze muss größer gleich 1 sein.");

    if ( seats !== options.additionalParticipants.length + 1 )
      throw new Meteor.Error(403, "Anzahl an Emails und Kursplätze stimmen nicht überein.");

    var fields = { eventId: 1, course: 1, courseFeePP: 1 };
    var booking = Bookings.findOne( { _id: options.bookingId }, { fields: fields } );
    checkExistance( booking, "Buchung", fields );

    var currentId = booking.eventId;
    var courseId = booking.course;

    fields = { participants: 1 };
    var current = Current.findOne( { _id: currentId }, { fields: fields } );
    checkExistance( current, "Event", fields );

    fields = { maxParticipants: 1 };
    var course = Courses.findOne( { _id: courseId }, { fields: fields } );
    checkExistance( course, "Kurs", fields );

    var afterBooking = current.participants.length + seats;

    // check if event is already booked out
    if ( afterBooking <= course.maxParticipants ) {
      // good, there are enough seats available in this course
      // here i need to add the participants to block the course-seats already for time of payment and remove the participants again if payment is no good ( error ) to unblock seats (let others book them)
      var newParticipants = [ this.userId ];
      // register the other ones if there are any
      if ( seats > 1 ) {
        // create new users
        for ( var i = seats - 2; i >= 0; i-- ) {
          newParticipants.push( createUserWoPassword( options.additionalParticipants[i] ) );
        } 
      }

      // add them to current.participants
      Current.update( { _id: currentId }, { $push: { participants: { $each: newParticipants } } } );

      // update booking
      var modifier = {
        transaction     :  'invoice open',
        transactionDate :  new Date(),
        amount          :  0,
        bookingStatus   :  'completed',
        seats           :  seats
      };

      // non-blocking coz with callback, also error doesnt end methods
      Bookings.update( { _id: booking._id }, { $set: modifier }, function ( error, result ) {
        if ( error ) {
          console.log( error );
          console.log( 'booking-id: ' + booking._id );
          console.log( 'event-id: ' + currentId );
          console.log( 'user-id: ' + this.userId );
        }
      });

      // inform participants via email
      for ( var i = newParticipants.length - 1; i >= 0; i-- ) {
        sendBookingConfirmationEmail( { course: course._id, userId: newParticipants[i] } );
      }

      // check if course is full now:
      if ( afterBooking === course.maxParticipants ) {
        // generate token for trainer to confirm the event 
        var token = Random.hexString(64); 
        // save in current
        Current.update( { _id : currentId }, { $set: { token: token } }, function ( error, result ) {
          if ( error ) {
            console.log( error );
          }
          else {
            // inform trainer (owner) that current event is full so that he can confirm the event
            Meteor.call('sendCourseFullTrainerEmail', { currentId: currentId, course: course._id, token: token }, function ( error, result ) {
              if ( error ) {
                console.log( error );
              }
            });
          }
        });
      }
      return;
    }
    else {
      throw new Meteor.Error("Event ist leider mittlerweile schon ausgebucht!");
    } 
  }
});

// can only be called from this file
var createUserWoPassword = function ( email ) {
  check( email, String );

  if (! EMAIL_REGEX.test( email ))
    throw new Meteor.Error(403, "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben.");

  var userId = Accounts.createUser( { email: email } );
  // safety belt. createUser is supposed to throw on error. send 500 error instead of sending an enrolment email with empty userid.
  if ( ! userId )
    throw new Meteor.Error(444, "Beim Erstellung des Nutzerkontos für weitere Teilnehmer ist ein Fehler aufgetreten.");
  else
    Meteor.defer( function () {
      try {
        Accounts.sendEnrollmentEmail( userId );
      }
      catch ( error ) {
        console.log( 'ERROR: sendEnrollmentEmail' );
        console.log( 'userId: ' + userId );
        console.log( error );
      }
    });
  return userId;                
};