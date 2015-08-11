var secret = Meteor.settings.paymill.testPrivateKey;
paymill = paymill(secret);

Meteor.methods({
  createTransaction: function (options) {
    check(options, {
      token: NonEmptyString,
      amount: Number,
      bookingId: NonEmptyString
    });
    
    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    var fields = { eventId: 1, course: 1, courseFeePP: 1 };
    var booking = Bookings.findOne( { _id: options.bookingId } );
    checkExistance( booking, "Buchung", fields );

    // the next one works only for 1 person, need to adapt for paying 2 or more seats
    if ( options.amount === booking.courseFeePP ) 
      throw new Meteor.Error(403, "Bezahlbetrag und Kurspreis pro Person stimmen nicht überein");

    var currentId = booking.eventId;
    var courseId = booking.course;

    fields = { participants: 1 };
    var current = Current.findOne( { _id: currentId }, { fields: fields } );
    checkExistance( current, "Event", fields );

    fields = { maxParticipants: 1, title: 1 };
    var course = Courses.findOne( { _id: courseId }, { fields: fields } );
    checkExistance( course, "Kurs", fields );

    var beforeBooking = current.participants.length;
    var afterBooking = current.participants.length + 1;

    // check if event is already booked out
    if (beforeBooking < course.maxParticipants) {
      // good, there are places available in this course
      // here i need to add the participant to block the course-place already for time of payment and remove the participant again if payment is no good ( error ) to unblock place (let others book this place)
      Current.update( { _id: currentId }, { $push: { participants: this.userId } } );

      // synchronous paymill call
      var paymillCreateTransactionSync = Meteor.wrapAsync(paymill.transactions.create);

      try {

        var user = Meteor.users.findOne( this.userId );

        var result = paymillCreateTransactionSync({
          amount      : options.amount,
          currency    : 'EUR',
          token       : options.token,
          description : 'user: ' + this.userId + ' ' + displayName( user ) + ' ; course: ' + courseId + ' ' + course.title + '; event: ' + currentId
        });

        // update booking
        var modifier = {
          transaction     :  result.data.id,
          transactionDate :  new Date(result.data.created_at * 1000), // unix timestamp is in sec, need millisec, hence * 1000
          amount          :  result.data.amount / 100,
          bookingStatus   :  'completed'
        };

        // non-blocking coz with callback, also error doesnt invoke catch, which is good coz money is with us
        Bookings.update( { _id: booking._id }, { $set: modifier }, function ( error, result ) {
          if ( error ) {
            console.log( error );
          }
        });

        // inform participant via email - with callback: may return error but rest of try-block will run anyway, w/o callback on error will invoke catch-block
        Meteor.call('sendBookingConfirmationEmail', { course: course._id }, function ( error, result ) {
          if ( error ) {
            console.log( error );
          }
        });

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
        Current.update( { _id: currentId }, { $pull: { participants: this.userId } } );
        throw new Meteor.Error( error.message );
      }
    }
    else {
      throw new Meteor.Error("Event ist leider mittlerweile schon ausgebucht!");
    } 
  }
});


