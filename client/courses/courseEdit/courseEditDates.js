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
    $('#editCourseEvents').datepicker({
      startDate: "-0d",
      language: "de",
      todayBtn: true,
      multidate: true,
      todayHighlight: true,
      // orientation: "top left"
    });
};

Template.editCourseDates.helpers({
  selected: function (one, two) {
    return one === two ? 'selected' : '';
  },
  niceDate: function () {
    return moment(this).format("DD.MM.YYYY");
  },
  hoverText: function () {
    return courseEditHoverText[ Session.get('showHoverText') ];
  }
  // allowInquiry: function () {
  //   if (typeof this.allowInquiry !== 'undefined')
  //     Session.setDefault("allowInquiry", this.allowInquiry);
  //   else
  //     Session.setDefault("allowInquiry", false);
  //   return Session.get("allowInquiry");
  // }
});

Template.editCourseDates.events({
  'click #addEventButton': function (event, template) {
    event.preventDefault();
    if (! this.duration) {
      $('#durationErrorField').parent().addClass('has-error');
      $('#durationErrorField').text('Bitte tragen Sie hier die Kursdauer in Tagen ein.');
      toastr.error( "Bitte geben Sie erst die Kursdauer in Tagen an." );
      return false;
    }

    if (! this.expires) {
      $('#expiresErrorField').parent().addClass('has-error');
      $('#expiresErrorField').text('Bitte geben Sie hier an, wie viele Wochen im voraus Ihr Kurs voll sein muss.');
      toastr.error( "Bitte geben Sie erst die gewünschte Vorlaufzeit an." );
      return false;
    }

    var datesArray = template.find("#editCourseEvents").value.split(',');
    datesArray = _.without(datesArray, '');

    if (! datesArray.length) {
      $('#eventsErrorField').parent().addClass('has-error');
      $('#eventsErrorField').text('Bitte tragen Sie hier alle Kurstage für Ihr Event ein.');
      toastr.error( "Sie haben keine Daten für Ihr Event angegeben." );
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

    var options = {course: this._id,
                  courseDate: dateObjectsArray };

    Meteor.call('createCurrent', options, function (error) {
      if (error) {
        toastr.error( error.reason );
        return false;
      }
    });

    var dates = []; // in case we go back to adding multiple events at once
    dates.push( dateObjectsArray );

    options = {_id: this._id,
              dates: dates };

    Meteor.call('addToCourseDates', options, function (error, result) {
      if (error)
        toastr.error( error.reason );
      else
        $('#editCourseEvents').datepicker('setDate', null);
    });

  },
  'click #saveEditCourseDates': function (event, template) {
    var duration = template.find("#editCourseDuration").value;
    var expires = template.find("#editCourseExpires").value;

    duration = parseInt(duration);
    expires = parseInt(expires);
    
    // var allowInquiry = template.find("#editCourseAllowInquiry").checked;
    var modifier = {_id: this._id,
                owner: this.owner,
                duration: duration,
                // allowInquiry: allowInquiry,
                expires: expires };
    Meteor.call('updateCourse', modifier, function (error, result) {
      if (error)
        toastr.error( error.reason );
      else
        toastr.success( 'Änderungen gespeichert.' );
    });

    Session.set('editCourseTemplate', "editCourseLogistics");

    $('#editCourseDates').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editCourseLogistics').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
    // if (this.dates) // might be empty, handle:
    //   var DBdates = this.dates;
    // else
    //   var DBdates = "";
    // var dates = template.find("#editCourseDates").value;
    // var datesArray = dates.split(',')
    // var DBdatesArray = DBdates.split(',')
    // var removedDates = _.difference(DBdatesArray,datesArray) // geht was weg
    // var addedDates = _.difference(datesArray,DBdatesArray) // kommt was hinzu
    // if (removedDates.length && removedDates[0]!=="") {
    //   for (var i = 0; i < removedDates.length; i++) {
    //     var current = Current.findOne({course: this._id, courseDate: removedDates[i]}, {fields: {participants:1}});
    //     if (! current.participants.length)
    //       Meteor.call('deleteCurrent', current._id, function (error, result) {});
    //     else {
    //       // or bootbox confirm delete coz there are already participants
    //       var dates = dates+','+removedDates[i]; // just keep it and don't allow deletion of this date
    //       $('#editCourseDates').datepicker('setDates', _.map(dates.split(','), function(date) {return new Date(reformatDate(date))} ) );
    //       toastr.error( 'Es gibt bereits Teilnehmer für diese Veranstalltung am '+ removedDates[i] +'.' );
    //     }
    //   }
    // } 
    // if (addedDates.length && addedDates[0]!=="") {
    //   for (var i = 0; i < addedDates.length; i++) {
    //     options = {course: this._id,
    //               owner: this.owner,
    //               courseDate: addedDates[i]}
    //     Meteor.call('createCurrent', options, function (error, result) {});
    //   }
    // }
  },
  // 'click #addDateField': function () {
  //   var newdDateField = '<div class="row"><div class="col-md-11"><div class="form-group"><div class="input-group"><input type="text" class="form-control editCourseDates hoverCheck" id="" name="dateField"  placeholder="tt.mm.jjjj" value=""><div class="input-group-addon"><i class="fa fa-calendar"></i></div></div></div></div><div class="col-md-1"><button type="button" class="btn btn-default pull-right removeDateField"><i class="fa fa-minus"></i></button></div></div>';
  //   $("#courseDatesGroup").append(newdDateField);
  //   $('.editCourseDates').datepicker({
  //     startDate: "-0d",
  //     language: "de",
  //     todayBtn: true,
  //     multidate: true,
  //     todayHighlight: true
  //   });
  // },
  // 'click .removeDateField': function (event, template) {
  //   $(event.currentTarget).parent().parent().remove();
  // },
  // 'change #editCourseAllowInquiry': function (event) {
  //   Session.set("allowInquiry", event.target.checked);
  // },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
});