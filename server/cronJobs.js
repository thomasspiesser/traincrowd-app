Schedule = new Meteor.Collection('schedule');

function removeExpiredCurrent(options) {
  // id of current to be removed
  // var current = Current.findOne(id);
  // email current.participants
  // remove from current
  // remove from course.dates
}

function setCurrentElapsed(options) {
  // course event happend so insert into elapsed
  var current = Current.findOne({_id: options.id});

  Elapsed.insert({
    _id: current._id,
    owner: current.owner,
    course: current.course,
    participants: current.participants,
    courseDate: current.courseDate
  });
  // email current.participants: Aufforderung bewertung

  //remove from Current:
  Current.remove({_id: options.id});
  // remove from course.dates
}

function addTask(id, options) {

  SyncedCron.add({
    name: id,
    schedule: function(parser) {
      return parser.recur().on(options.date).fullDate();
    },
    job: function() {
      if (options.remove)
        removeExpiredCurrent(options);
      if (options.setElapsed)
        setCurrentElapsed(options);
      Schedule.remove(id);
      SyncedCron.remove(id);
      return id;
    }
  });

}

function scheduleTask(options) { 

  if (options.date < new Date()) {
    if (options.remove)
      removeExpiredCurrent(options);
    if (options.setElapsed)
      setCurrentElapsed(options);
  } else {
    var thisId = Schedule.insert(options);
    addTask(thisId, options);
  }
  return true;

}

Meteor.startup(function() {

  Schedule.find().forEach(function(task) {
    if (task.date < new Date()) {
      if (options.remove)
        removeExpiredCurrent(options);
      if (options.setElapsed)
        setCurrentElapsed(options);
    } else {
      addTask(task._id, task);
    }
  });
  SyncedCron.start();

});