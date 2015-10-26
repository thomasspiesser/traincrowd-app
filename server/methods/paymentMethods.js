const secret = Meteor.settings.paymill.livePrivateKey;
paymill = paymill(secret);

Meteor.methods({
  createTransaction( options ) {
    check(options, {
      token: NonEmptyString,
      amount: Number,
      bookingId: NonEmptyString,
      seats: Number,
      additionalParticipants: [ String ], // the array of emails for the other participants
    });

    if ( ! this.userId ) {
      throw new Meteor.Error(403, 'Sie müssen eingelogged sein');
    }

    let bookingId = options.bookingId;
    let seats = parseInt( options.seats, 10 );
    if ( seats < 1 ) {
      let errMsg = 'Anzahl der Kursplätze muss größer gleich 1 sein.';
      throw new Meteor.Error( 403, errMsg );
    }

    if ( seats !== options.additionalParticipants.length + 1 ) {
      let errMsg = 'Anzahl an Emails und Kursplätze stimmen nicht überein.';
      throw new Meteor.Error( 403, errMsg );
    }

    let fields = { eventId: 1, course: 1, courseFeePP: 1, coupon: 1 };
    let booking = Bookings.findOne( { _id: bookingId }, { fields: fields } );
    checkExistance( booking, 'Buchung', _.omit( fields, 'coupon' ) );

    let couponAmount = booking.coupon && booking.coupon.amount || 0;

    // amount is in cents!
    let total = ( booking.courseFeePP - couponAmount ) * seats * 100;
    if ( options.amount / 100 !==  total ) {
      let errMsg = noIndent( `Bezahlbetrag und Kurspreis für ${seats}\
              Person(en) stimmen nicht überein` );
      throw new Meteor.Error( 403, errMsg );
    }

    let currentId = booking.eventId;
    let courseId = booking.course;

    fields = { participants: 1 };
    let current = Current.findOne( { _id: currentId }, { fields: fields } );
    checkExistance( current, 'Event', fields );

    fields = { maxParticipants: 1, title: 1 };
    let course = Courses.findOne( { _id: courseId }, { fields: fields } );
    checkExistance( course, 'Kurs', fields );

    let afterBooking = current.participants.length + seats;

    // check if there are enough seats available
    if ( afterBooking <= course.maxParticipants ) {
      // good, there are enough seats available in this course
      // here i need to add the participants to block the course-seats already for time of payment and remove the participants again if payment is no good ( error ) to unblock seats (let others book them)
      let newParticipants = [ this.userId ];
      // register the other ones if there are any
      if ( seats > 1 ) {
        // look up users by email or create new users
        for ( let email of options.additionalParticipants ) {
          let user = Meteor.users.findOne( { 'emails.address': email }, {
            fields: { _id: 1 },
          });
          if ( user ) {
            newParticipants.push( user._id );
          } else {
            newParticipants.push( _createUserWoPassword( email ) );
          }
        }
      }

      // add them to current.participants
      Current.update( { _id: currentId }, {
        $push: { participants: { $each: newParticipants } },
      });

      // synchronous paymill call
      let paymillCreateTransactionSync = Meteor.wrapAsync(
        paymill.transactions.create
      );

      try {
        let user = Meteor.users.findOne( this.userId );

        let result = paymillCreateTransactionSync({
          amount: options.amount,
          currency: 'EUR',
          token: options.token,
          description: noIndent( `user: ${this.userId} ${user.getName()};\
            booking: ${bookingId}` ),
        });

        // update booking
        let modifier = {
          transaction: result.data.id,
          transactionDate: new Date( result.data.created_at * 1000 ), // unix timestamp is in sec, need millisec, hence * 1000
          amount: result.data.amount / 100,
          bookingStatus: 'completed',
          seats: seats,
        };

        if ( seats > 1 ) {
          modifier.additionalCustomers = options.additionalParticipants;
        }

        // non-blocking coz with callback, also error doesnt invoke catch, which is good coz money is with us
        Bookings.update( { _id: bookingId }, { $set: modifier }, ( error ) => {
          if ( error ) {
            console.log( error );
            console.log( 'modifier: ' + modifier );
            console.log( 'booking-id: ' + bookingId );
            console.log( 'event-id: ' + currentId );
            console.log( 'user-id: ' + this.userId );
          }
        });

        // inform participants via email
        for ( let newParticipant of newParticipants ) {
          let args = {
            course: course._id,
            userId: newParticipant,
            bookingId: bookingId,
            attachBill: true,
          };
          sendBookingConfirmationEmail( args );
        }

        // check if course is full now:
        if ( afterBooking === course.maxParticipants ) {
          // generate token for trainer to confirm the event
          let token = Random.hexString(64);
          // save in current
          Current.update( { _id: currentId }, {
            $set: { token: token },
          }, ( error ) => {
            if ( error ) {
              console.log( error );
            } else {
              // inform trainer (owner) that current event is full so that he can confirm the event
              let args = {
                currentId: currentId,
                course: course._id,
                token: token,
              };
              Meteor.call('sendCourseFullTrainerEmail', args, ( error ) => {
                if ( error ) {
                  console.log( error );
                }
              });
            }
          });
        }
        return result;
      } catch ( error ) {
        console.log( error );
        // remove Participant again - coz payment failed - careful this operation will pull ALL participants with this Id from the list
        Current.update(
          { _id: currentId },
          { $pull: { participants: { $in: newParticipants } } }
        );
        throw new Meteor.Error( error.message );
      }
    } else {
      throw new Meteor.Error('Event ist leider mittlerweile schon ausgebucht!');
    }
  },
  createInvoice( options ) {
    check(options, {
      bookingId: NonEmptyString,
      seats: Number,
      additionalParticipants: [ String ], // the array of emails for the other participants
    });

    if ( ! this.userId ) {
      throw new Meteor.Error(403, 'Sie müssen eingelogged sein');
    }

    let bookingId = options.bookingId;
    let seats = parseInt( options.seats, 10 );
    if ( seats < 1 ) {
      let errMsg = 'Anzahl der Kursplätze muss größer gleich 1 sein.';
      throw new Meteor.Error( 403, errMsg );
    }

    if ( seats !== options.additionalParticipants.length + 1 ) {
      let errMsg = 'Anzahl an Emails und Kursplätze stimmen nicht überein.';
      throw new Meteor.Error( 403, errMsg );
    }

    let fields = { eventId: 1, course: 1, courseFeePP: 1 };
    let booking = Bookings.findOne( { _id: bookingId }, { fields: fields } );
    checkExistance( booking, 'Buchung', fields );

    let currentId = booking.eventId;
    let courseId = booking.course;

    fields = { participants: 1 };
    let current = Current.findOne( { _id: currentId }, { fields: fields } );
    checkExistance( current, 'Event', fields );

    fields = { maxParticipants: 1 };
    let course = Courses.findOne( { _id: courseId }, { fields: fields } );
    checkExistance( course, 'Kurs', fields );

    let afterBooking = current.participants.length + seats;

    // check if event is already booked out
    if ( afterBooking <= course.maxParticipants ) {
      // good, there are enough seats available in this course
      // here i need to add the participants to block the course-seats already for time of payment and remove the participants again if payment is no good ( error ) to unblock seats (let others book them)
      let newParticipants = [ this.userId ];
      // register the other ones if there are any
      if ( seats > 1 ) {
        // create new users
        for ( let email of options.additionalParticipants) {
          let user = Meteor.users.findOne(
            { 'emails.address': email }, { fields: { _id: 1 } }
          );
          if ( user ) {
            newParticipants.push( user._id );
          } else {
            newParticipants.push( _createUserWoPassword( email ) );
          }
        }
      }

      // add them to current.participants
      Current.update( { _id: currentId }, {
        $push: { participants: { $each: newParticipants } },
      });

      // update booking
      let modifier = {
        transaction: 'invoice open',
        transactionDate: new Date(),
        amount: 0,
        bookingStatus: 'completed',
        seats: seats,
      };

      if ( seats > 1 ) {
        modifier.additionalCustomers = options.additionalParticipants;
      }

      // non-blocking coz with callback, alsoerrordoesnt end methods
      Bookings.update( { _id: bookingId }, { $set: modifier }, ( error ) => {
        if ( error ) {
          console.log( error );
          console.log( 'booking-id: ' + bookingId );
          console.log( 'event-id: ' + currentId );
          console.log( 'user-id: ' + this.userId );
        }
      });

      // inform participants via email
      for ( let newParticipant of newParticipants ) {
        let args = {
          course: course._id,
          userId: newParticipant,
          bookingId: bookingId,
          attachBill: true,
        };
        sendBookingConfirmationEmail( args );
      }

      // check if course is full now:
      if ( afterBooking === course.maxParticipants ) {
        // generate token for trainer to confirm the event
        let token = Random.hexString(64);
        // save in current
        Current.update( { _id: currentId }, {
          $set: { token: token },
        }, ( error ) => {
          if ( error ) {
            console.log( error );
          } else {
            // inform trainer (owner) that current event is full so that he can confirm the event
            let args = {
              currentId: currentId,
              course: course._id,
              token: token,
            };
            Meteor.call('sendCourseFullTrainerEmail', args, ( error ) => {
              if ( error ) {
                console.log( error );
              }
            });
          }
        });
      }
    } else {
      throw new Meteor.Error('Event ist leider mittlerweile schon ausgebucht!');
    }
  },
  enrollFreeEvent( options ) {
    check(options, {
      currentId: NonEmptyString,
    });

    if ( ! this.userId ) {
      throw new Meteor.Error(403, 'Sie müssen eingelogged sein!');
    }

    let currentId = options.currentId;

    fields = { participants: 1, course: 1 };
    let current = Current.findOne( { _id: currentId }, { fields: fields } );
    checkExistance( current, 'Event', fields );

    fields = { maxParticipants: 1, fee: 1 };
    let course = Courses.findOne( { _id: current.course }, { fields: fields } );
    checkExistance( course, 'Kurs', fields );

    if ( course.fee !== 0 ) {
      throw new Meteor.Error(433, 'Dieser Kurs ist nicht gratis!');
    }

    let afterBooking = current.participants.length;

    if ( afterBooking <= course.maxParticipants ) {
      Current.update( { _id: currentId }, {
        $push: { participants: this.userId },
      });
      let args = {
        course: course._id,
        userId: this.userId,
        attachBill: false,
      };
      sendBookingConfirmationEmail( args );
      // check if course is full now:
      if ( afterBooking === course.maxParticipants ) {
        // generate token for trainer to confirm the event
        let token = Random.hexString(64);
        // save in current
        Current.update( { _id: currentId }, {
          $set: { token: token },
        }, ( error ) => {
          if ( error ) {
            console.log( error );
          } else {
            // inform trainer (owner) that current event is full so that he can confirm the event
            args = {
              currentId: currentId,
              course: course._id,
              token: token,
            };
            Meteor.call('sendCourseFullTrainerEmail', args, ( error ) => {
              if ( error ) {
                console.log( error );
              }
            });
          }
        });
      }
    } else {
      throw new Meteor.Error('Event ist leider mittlerweile schon ausgebucht!');
    }
  },
});

// can only be called from this file like this
function _createUserWoPassword( email ) {
  check(email, String);

  if ( ! EMAIL_REGEX.test( email ) ) {
    throw new Meteor.Error(403, noIndent( `Bitte überprüfen Sie, ob Sie eine\
      echte Email Adresse eingegeben haben.` ) );
  }

  let userId = Accounts.createUser( { email: email } );
  // safety belt. createUser is supposed to throw on error. send 500errorinstead of sending an enrolment email with empty userid.
  if ( ! userId ) {
    throw new Meteor.Error(444, noIndent( `Beim Erstellung des Nutzerkontos\
      für weitere Teilnehmer ist ein Fehler aufgetreten.` ) );
  } else {
    Meteor.defer( function() {
      try {
        Accounts.sendEnrollmentEmail( userId );
      } catch ( error ) {
        console.log( 'ERROR: sendEnrollmentEmail' );
        console.log( 'userId: ' + userId );
        console.log( error );
      }
    });
  }
  return userId;
}
