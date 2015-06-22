$.fn.datepicker.dates['de'] = {
    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
    daysShort: ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"],
    daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    today: "Heute",
    clear: "Löschen",
    weekStart: 1,
    format: "dd.mm.yyyy"
  };

Template.editCourseDates.rendered=function() {
    $('#edit-course-events').datepicker({
      startDate: "-0d",
      language: "de",
      todayBtn: true,
      multidate: true,
      todayHighlight: true,
      // orientation: "top left"
    });
};

Template.editCourseDates.helpers({
  niceDate: function () {
    return moment(this).format("DD.MM.YYYY");
  },
  // allowInquiry: function () {
  //   if (typeof this.allowInquiry !== 'undefined')
  //     Session.setDefault("allowInquiry", this.allowInquiry);
  //   else
  //     Session.setDefault("allowInquiry", false);
  //   return Session.get("allowInquiry");
  // }
});

Template.editCourseDates.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-course-'+field).parent().removeClass('has-error');
    $('#help-text-edit-course-'+field).text('speichern...').fadeIn(300);
    lazysaveCourseField( { id: this._id, argName: field, argValue: event.currentTarget.value } );
  },
  'click #addEventButton': function (event, template) {
    event.preventDefault();
    if (! this.duration) {
      formFeedbackError( '#edit-course-duration', '#help-text-edit-course-duration','Bitte tragen Sie hier die Kursdauer in Tagen ein.', "Bitte geben Sie erst die Kursdauer in Tagen an." );
      return false;
    }

    if (! this.expires) {
      formFeedbackError( '#edit-course-expires', '#help-text-edit-course-expires', 'Bitte geben Sie hier an, wie viele Wochen im voraus Ihr Kurs voll sein muss.', "Bitte geben Sie erst die gewünschte Vorlaufzeit an." );
      return false;
    }

    var datesArray = template.find("#edit-course-events").value.split(',');
    datesArray = _.without(datesArray, '');

    if (! datesArray.length) {
      formFeedbackError( '#edit-course-events', '#help-text-edit-course-events', 'Bitte tragen Sie hier alle Kurstage für Ihr Event ein.', "Sie haben keine Daten für Ihr Event angegeben." );
      return false;
    }

    if (datesArray.length !== this.duration) {
      toastr.error( "Kursdauer und Anzahl der Kurstage stimmen nicht überein." );
      return false;
    }

    var dateObjectsArray = _.map(datesArray, function(date) { return moment(date, "DD.MM.YYYY")._d; } ); // returns the date object - thats what we will store in the DB
    dateObjectsArray.sort(function (a,b) { return a-b; }); // sort dates

    var expiredAt = new Date(+dateObjectsArray[0] - 1000 * 60 * 60 * 24 * 7 * this.expires);
    
    if (expiredAt < new Date()) {
      toastr.error( "Das Event scheint bereits abgelaufen." );
      return false;
    }

    var options = {courseId: this._id,
                  courseDate: dateObjectsArray };

    Meteor.call('createEvent', options, function (error, result) {
      if (error)
        toastr.error( error.reason );
      else
        $('#edit-course-events').datepicker('setDate', null);
    });

  },
  'click .removeEvent': function (event, template) {
    var course = Template.currentData();
    var courseDate = this;
    var current = Current.findOne({course: course._id, courseDate: courseDate}, {fields: {participants:1}});
    if (! current.participants.length) {
      if (confirm('Event wirklich löschen?')) {
        var options = {
          courseId: course._id,
          currentId: current._id,
          courseDate: courseDate
        };
        Meteor.call('deleteEvent', options, function (error) {
          if (error)
            toastr.error( error.reason );
          else 
            toastr.success( "Das Event wurde erfolgreich gelöscht!" );
        });
      }
    }
    else {
      toastr.error( 'Es gibt bereits Teilnehmer für dieses Event. Bitte kontaktieren Sie uns und wir finden gemeinsam eine Lösung.');
    }
  },
  'click #saveEditCourseDates': function (event, template) {

    Session.set('editCourseTemplate', "editCourseLogistics");

    $('#editCourseDates').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editCourseLogistics').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  },
  // 'change #editCourseAllowInquiry': function (event) {
  //   Session.set("allowInquiry", event.target.checked);
  // },
});

Template.editCourseDates.events( hoverCheckEvents );