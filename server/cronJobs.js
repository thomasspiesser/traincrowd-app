Meteor.methods({
  startSearchForExpired: function () {
    setExpired();
  },
  startSearchForElapsed: function () {
    setElapsed();
  }
});

function setExpired() {
  var expiredEvents = [];
  // TODO: what to do with those that are just karteileichen (nicht fertig ausgefüllt etc) - sollten removed werden aber werfen evtl Fehler. Abfangen - und löschen!
  Current.find().forEach(function (current) {
    if ( current.confirmed )
      return;

    var course = Courses.findOne( { _id: current.course }, { fields: { expires: 1, dates: 1, maxParticipants: 1 } } );

    if ( ! course ) {
      console.log( "ERROR: Kurs nicht gefunden. Id: " + current._id );
      return;
    }

    if ( ! course.dates ) {
      console.log( "ERROR: Kurs.dates nicht gefunden. Id: " + current._id );
      return;
    }

    if ( course.maxParticipants && current.participants.length === course.maxParticipants )
      return;

    var date = _.first( current.courseDate ); // first day of the event
    date = moment( date );

    if ( course.expires ) {
      // calc when the event expires: courseDate - no.of weeks before
      date.subtract( parseInt( course.expires ), 'weeks' );
    }
    
    if ( date < new Date() ) {

      if ( current.participants.length ) {
        // if there are participants at all, trainer should have the possibility to do it anyways
        // generate token to confirm/decline the event 
        var token = Random.hexString(64); 
        // save in current
        Current.update( { _id: current._id }, { $set: { token: token } } );
        // email owner: Fragen ob er den Kurs trotzdem machen will
        Meteor.call( 'sendAskIfEventExpiredTrainerEmail', { course: current.course, currentId: current._id, token: token }, function (error, result ) {
            if ( error )
              console.log("ERROR: " + error );
          });
        return;
      }

      else {
        // inform trainer event expired
        Meteor.call( 'sendInformEventExpiredTrainerEmail', { course: current.course, currentId: current._id }, function ( error, result ) {
          if ( error )
            console.log("ERROR: " + error );
        });
        // for the record
        expiredEvents.push( current._id ); 
        // remove from course.dates
        if ( course.dates.length === 1 ) 
          Courses.update( { _id: current.course }, { $pull: { dates: current.courseDate }, $set: { hasDate: false } } );
        else {
          // this workaround to pull just one not all elements breaks atomicity
          Courses.update( { _id: current.course, dates: current.courseDate }, { $unset: { "dates.$": current.courseDate } } );
          Courses.update( { _id: current.course }, { $pull: { dates: null } } );
          // Courses.update( { _id: current.course }, { $pull: { dates: current.courseDate } } );
        }
        // remove from Current:
        Current.remove( current._id );
      }

    }
  }); 
  return expiredEvents;
}

function setElapsed() {
  var elapsedEvents = [];
  Current.find().forEach( function ( current ) {
    var date = _.last( current.courseDate ); // last day of the event
    if ( date < new Date() ) {
      var course = Courses.findOne( { _id: current.course }, { fields: { dates: 1 } } );

      if ( ! course ) {
        console.log( "ERROR: Kurs nicht gefunden. Id: " + current._id );
        return;
      }

      if ( ! course.dates ) {
        console.log( "ERROR: Kurs.dates nicht gefunden. Id: " + current._id );
        return;
      }

      // for the record
      elapsedEvents.push( current._id ); 

      // insert into elapsed
      Elapsed.insert({
        _id: current._id,
        owner: current.owner,
        ownerName: current.ownerName,
        course: current.course,
        courseTitle: current.courseTitle,
        participants: current.participants,
        courseDate: current.courseDate
      });

      // if ( current.participants && current.participants.length ) {
      //   // email current.participants: Aufforderung bewertung
      //   Meteor.call( 'sendRateCourseEmail', { elapsedId: current._id }, function ( error, result ) {
      //     if ( error ) {
      //       console.log( error );
      //     }
      //   });
      // }

      // remove from course.dates
      if ( course.dates.length === 1 ) 
        Courses.update( { _id: current.course }, { $pull: { dates: current.courseDate }, $set: { hasDate: false } } );
      else {
        // this workaround to pull just one not all elements breaks atomicity
        Courses.update( { _id: current.course, dates: current.courseDate }, { $unset: { "dates.$": current.courseDate } } );
        Courses.update( { _id: current.course }, { $pull: { dates: null } } );
        // Courses.update( { _id: current.course }, { $pull: { dates: current.courseDate } } );
      }
      // remove from Current:
      Current.remove( current._id );
    }
  }); 
  return elapsedEvents;
}

SyncedCron.add({
  name: 'Scan for elapsed',
  schedule: function(parser) {
    return parser.text('at 21:30 am'); // run at 21:30 in the evening every day
  }, 
  job: function() {
    var elapsedEvents = setElapsed();
    return elapsedEvents;
  }
});

SyncedCron.add({
  name: 'Scan for expired',
  schedule: function(parser) {
    return parser.text('at 03:00 am'); // run at 3 in the morning every day
  }, 
  job: function() {
    var expiredEvents = setExpired();
    return expiredEvents;
  }
});

Meteor.startup(function() {

  SyncedCron.start();

});