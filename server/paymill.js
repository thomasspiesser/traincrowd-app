var secret = Meteor.settings.paymill.testPrivateKey;
paymill = paymill(secret);

Meteor.methods({
  createTransaction: function (options) {
    check(options, {
      token: NonEmptyString,
      amount: Number,
      currentId: NonEmptyString
    });
    var currentId = options.currentId;

    if (! this.userId)
      throw new Meteor.Error(403, "Sie müssen eingelogged sein");

    // check if event is already booked out
    var current = Current.findOne({_id: currentId}, { fields: { participants:1, course:1 } });
    var course = Courses.findOne({_id: current.course}, { fields: { maxParticipants:1} });
    var beforeBooking = current.participants.length;
    var afterBooking = current.participants.length + 1;

    if (beforeBooking < course.maxParticipants) {
      // good, there are places available in this course
      // here i need to add the participant to block the course-place already for time of payment and remove the participant again if payment is no good (error) to unblock place (let others book this place)
      // addParticipant
      Current.update(
        {_id: currentId},
        {$push: { participants: this.userId }});

      // synchronous paymill call
      var paymillCreateTransactionSync = Meteor.wrapAsync(paymill.transactions.create);

      try{
        var result = paymillCreateTransactionSync({
          amount: options.amount,
          currency: 'EUR',
          token: options.token,
          description: 'user: ' + this.userId + ' course: ' + current.course + ' current: ' + currentId
        });
        // insert transaction into Transactions.collection
        var user = Meteor.users.findOne( this.userId );
        var trans = {
          _id: result.id,
          userId: this.userId,
          userEmail: displayEmail( user ),
          amount: result.amount,
          date: result.created_at
        };
        var transId = Transactions.insert(trans);
        // inform participant via email
        Meteor.call('sendBookingConfirmationEmail', { course: course._id, userId: this.userId } );
        // check if course is full now:
        if (afterBooking === course.maxParticipants) {
          // generate token for trainer to confirm the event 
          var token = Random.hexString(64); 
          // save in current
          Current.update(
            {_id: currentId},
            {$set: { token: token }});
          // inform trainer (owner) that current event is full so that he can confirm the event
          Meteor.call('sendCourseFullTrainerEmail', {currentId: currentId, course: course._id, token: token } );
        }
        return result;
      }
      catch(error){
        // remove Participant again - coz payment failed
        Current.update(
          {_id: currentId},
          {$pull: { participants: this.userId }});

        return error;
      }
    }
    else {
      throw new Meteor.Error("Event ist leider mittlerweile schon ausgebucht!");
    } 
  }
});


