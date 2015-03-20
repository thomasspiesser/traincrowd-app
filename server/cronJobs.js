function setExpired() {
  var expiredEvents = [];
  // TODO: what to do with those that are just karteileichen (nicht fertig ausgefüllt etc) - sollten removed werden aber werfen evtl Fehler. Abfangen - und löschen!
  Current.find().forEach(function (current) {
    if ( current.confirmed )
      return;

    var course = Courses.findOne( { _id: current.course }, { fields: { expires: 1, dates: 1, maxParticipants: 1 } } );

    if ( current.participants.length === course.maxParticipants )
      return;

    var date = _.first(current.courseDate); // first day of the event

    if (course.expires) {
      // calc when the event expires: courseDate - no.of weeks before
      date = new Date(+date - 1000 * 60 * 60 * 24 * 7 * course.expires); // milliseconds in one second * seconds in a minute * minutes in an hour * hours in a day * days in a week * weeks
    }
    if (date < new Date()) {

      if ( current.participants.length ) {
        // if there are participants at all, trainer should have the possibility to do it anyways
        // generate token to confirm/decline the event 
        var token = Random.hexString(64); 
        // save in current
        Current.update(
          {_id: current._id},
          {$set: { token: token }});
        // email owner: Fragen ob er den Kurs trotzdem machen will
        Meteor.call('sendAskIfEventExpiredTrainerEmail', { course: current.course, currentId: current._id, token: token } );
      }

      else {
        // inform trainer event expired
        Meteor.call('sendInformEventExpiredTrainerEmail', { course: current.course, currentId: current._id } );
        // for the record
        expiredEvents.push(current._id); 
        // remove from course.dates
        Courses.update({_id: current.course}, { $pull: { dates: current.courseDate } });
        // remove from Current:
        Current.remove(current._id);
      }

    }
    return expiredEvents;
  }); 
}

function setElapsed() {
  var elapsedEvents = [];
  Current.find().forEach(function (current) {
    var date = _.last(current.courseDate); // last day of the event
    if (date < new Date()) {
      Elapsed.insert({
        _id: current._id,
        owner: current.owner,
        course: current.course,
        participants: current.participants,
        courseDate: current.courseDate
      });
      elapsedEvents.push(current._id); // for the record

      // email current.participants: Aufforderung bewertung
      Meteor.call('sendRateCourseEmail', {course: current.course, participants: current.participants});

      // remove from course.dates
      Courses.update({_id: current.course}, { $pull: { dates: current.courseDate } });
      // remove from Current:
      Current.remove(current._id);
    }
    return elapsedEvents;
  }); 
}

SyncedCron.add({
  name: 'Scan for elapsed',
  schedule: function(parser) {
    return parser.text('at 03:00 am'); // run at 3 in the morning every day
  }, 
  job: function() {
    var elapsedEvents = setElapsed();
    return elapsedEvents;
  }
});

SyncedCron.add({
  name: 'Scan for expired',
  schedule: function(parser) {
    return parser.text('at 03:10 am'); // run at 10 past 3 in the morning every day
  }, 
  job: function() {
    var expiredEvents = setExpired();
    return expiredEvents;
  }
});

Meteor.startup(function() {

  SyncedCron.start();

});