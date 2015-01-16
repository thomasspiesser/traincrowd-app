//////////// editCourse template /////////

var getText = function(id) {
  var text;
  switch (id) {
    case 'editCourseTitle': 
      text = Fake.paragraph(4);
      return text;
      break;
    case 'editCourseShortDescription':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseImage':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseDefaultImage':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseAims': 
      text = Fake.paragraph(4);
      return text;
      break;
    case 'editCourseMethods':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseTargetGroup':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCoursePrerequisites':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseLanguages': 
      text = Fake.paragraph(4);
      return text;
      break;
    case 'editCourseFee':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseMinParticipants':
    case 'editCourseMaxParticipants':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseDuration':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseAdditionalServices':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseDates':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseAllowInquiry':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editCourseExpires':
      text = Fake.paragraph(6);
      return text;
      break;
    default:
      text = "";
      return text;
  }
}

Template.editCourse.helpers({
  showHoverText: function () {
    return getText(Session.get( 'showHoverText' ));
  }
});

Template.editCourse.events({ 
  'click #removeCourseButton': function (event, template) {
    Courses.remove(this._id);
    Router.go("/courses");
  },
  'click #previewCourseButton': function (event, template) {
    // TODO: publish is false but owner can see the course
    Router.go("course.show", {_id: this._id} );
  }
});

//////////// local functions /////////

var saveUpdates = function (modifier) {
  Meteor.call('updateCourse', modifier, function (error, result) {
    if (error)
      Notifications.error('Fehler!', error, {timeout: 8000});
    else
      Notifications.info('', 'Änderungen gespeichert.', {timeout: 8000});
  });
}

//////////// editCourse DESCRIPTION template /////////

Template.editCourseDescription.events({
  'click #saveEditCourseDescription': function (event, template) {
    var title = template.find("#editCourseTitle").value;
    var description = template.find("#editCourseShortDescription").value;
    var newImage = template.find("#newCourseImageReal").files[0];

    if (! title.length) {
      Notifications.error('Fehler!', "Der Kurs braucht einen Titel.", {timeout: 8000});
      return false
    }

    modifier = {_id: this._id,
                owner: this.owner,
                title: title,
                description: description }
    saveUpdates(modifier);

    if (newImage) {
      var self = this;
      var reader = new FileReader();
      reader.onload = function(event) {
        if (self.imageId) {
          var modifier = {_id: self.imageId,
                          data: event.target.result }
          Meteor.call('updateImage', modifier, function (error, result) {
            if (error)
              Notifications.error('Fehler!', error, {timeout: 8000});
          });
        } 
        else {
          var modifier = {data: event.target.result,
                          course: self._id}
          Meteor.call('insertCourseImage', modifier, function (error, imageId) {
            if (error)
              Notifications.error('Fehler!', error, {timeout: 8000});
            else {
              var modifier = {_id: self._id,
                              owner: self.owner,
                              imageId: imageId}
              saveUpdates(modifier);
            }
          });
        }
      };
      reader.readAsDataURL(newImage);
    }
    return false;
    
    // check all for appropriate type
    // provide user feedback if error from one of the above checks
  },
  'click #newCourseImageDummy': function () {
    $('#newCourseImageReal').click();
  },
  'click #deleteCourseImage': function () {
    if (! this.imageId) //if there is nothing to delete
      return false;
    var self = this; // needed, coz this in bootbox is bootbox object
    bootbox.confirm('Image löschen?', function(result) {
      if (result) {
        modifier = {_id: self._id,
                    owner: self.owner,
                    imageId: '' }
        saveUpdates(modifier);
        Meteor.call('removeImage', self.imageId, function (error, result) {
          if (error)
            Notifications.error('Fehler!', error, {timeout: 8000});
        });
      }
    });
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  }
});

//////////// editCourse DETAILS template /////////

Template.editCourseDetails.events({
  'click #saveEditCourseDetails': function (event, template) {
    var aims = template.find("#editCourseAims").value;
    var methods = template.find("#editCourseMethods").value;
    var targetGroup = template.find("#editCourseTargetGroup").value;
    var prerequisites = template.find("#editCoursePrerequisites").value;
    var languages = template.find("#editCourseLanguages").value;

    modifier = {_id: this._id,
                owner: this.owner,
                aims: aims,
                methods: methods,
                targetGroup: targetGroup,
                prerequisites: prerequisites,
                languages: languages }

    saveUpdates(modifier);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  }
});

//////////// editCourse COSTS template /////////

Template.editCourseCosts.events({
  'click #saveEditCourseCosts': function (event, template) {
    var fee = template.find("#editCourseFee").value;

    if (! fee.length) {
      Notifications.error('Fehler!', "Sie müssen einen Preis angeben.", {timeout: 8000});
      return false
    }
    var fee = parseFloat(fee).toFixed(2); // rounded to 2 digits
    modifier = {_id: this._id,
                owner: this.owner,
                fee: fee }
    saveUpdates(modifier);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  }
});

//////////// editCourse SERVICES template /////////

Template.editCourseServices.helpers({
  selected: function (one, two) {
    return one === two ? 'selected' : '';
  }
});

Template.editCourseServices.events({
  'click #saveEditCourseServices': function (event, template) {
    var minParticipants = template.find("#editCourseMinParticipants").value;
    var maxParticipants = template.find("#editCourseMaxParticipants").value;

    if (! minParticipants.length || ! maxParticipants.length) {
      Notifications.error('Fehler!', "Sie müssen die Teilnehmerzahlen angeben.", {timeout: 8000});
      return false
    }
    var minParticipants = parseInt(minParticipants);
    var maxParticipants = parseInt(maxParticipants);

    if (minParticipants > maxParticipants) {
      Notifications.error('Fehler!', "Die maximale Gruppengröße muss mindestens "+minParticipants+" sein.", {timeout: 8000});
      return false
    }

    var duration = template.find("#editCourseDuration").value;
    var additionalServices = template.find("#editCourseAdditionalServices").value;
    modifier = {_id: this._id,
                owner: this.owner,
                minParticipants: minParticipants,
                maxParticipants: maxParticipants,
                duration: duration,
                additionalServices: additionalServices }
    saveUpdates(modifier);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  }
});

//////////// editCourse DATES template /////////

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
    // format: "yyyy.mm.dd"
  };

Template.editCourseDates.rendered=function() {
    $('#editCourseDates').datepicker({
      startDate: "-0d",
      language: "de",
      todayBtn: true,
      multidate: 6,
      todayHighlight: true
    });
};

Template.editCourseDates.helpers({
  selected: function (one, two) {
    return one === two ? 'selected' : '';
  },
  allowInquiry: function () {
    if (typeof this.allowInquiry !== 'undefined')
      Session.setDefault("allowInquiry", this.allowInquiry);
    else
      Session.setDefault("allowInquiry", false);
    return Session.get("allowInquiry");
  }
});

Template.editCourseDates.events({
  'click #saveEditCourseDates': function (event, template) {
    if (this.dates) // might be empty, handle:
      var DBdates = this.dates;
    else
      var DBdates = "";
    var dates = template.find("#editCourseDates").value;
    var datesArray = dates.split(',')
    var DBdatesArray = DBdates.split(',')
    var removedDates = _.difference(DBdatesArray,datesArray) // geht was weg
    var addedDates = _.difference(datesArray,DBdatesArray) // kommt was hinzu
    if (removedDates.length && removedDates[0]!=="") {
      for (var i = 0; i < removedDates.length; i++) {
        var current = Current.findOne({course: this._id, courseDate: removedDates[i]}, {fields: {participants:1}});
        if (! current.participants.length)
          Meteor.call('deleteCurrent', current._id, function (error, result) {});
        else {
          // or bootbox confirm delete coz there are already participants
          var dates = dates+','+removedDates[i]; // just keep it and don't allow deletion of this date
          $('#editCourseDates').datepicker('setDates', _.map(dates.split(','), function(date) {return new Date(reformatDate(date))} ) );
          Notifications.error('Fehler!', 'Es gibt bereits Teilnehmer für diese Veranstalltung am '+  removedDates[i] +'.', {timeout: 8000});
        }
      }
    } 
    if (addedDates.length && addedDates[0]!=="") {
      for (var i = 0; i < addedDates.length; i++) {
        options = {course: this._id,
                  owner: this.owner,
                  courseDate: addedDates[i]}
        Meteor.call('createCurrent', options, function (error, result) {});
      }
    }
    var allowInquiry = template.find("#editCourseAllowInquiry").checked;
    var expires = template.find("#editCourseExpires").value;
    modifier = {_id: this._id,
                owner: this.owner,
                dates: dates,
                allowInquiry: allowInquiry,
                expires: expires }
    saveUpdates(modifier);
  },
  'change #editCourseAllowInquiry': function (event) {
    Session.set("allowInquiry", event.target.checked);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  }
});

//////////// editCourse LOGISTICS template /////////

Template.editCourseLogistics.helpers({
  noLocation: function () {
    if (typeof this.noLocation !== 'undefined')
      Session.setDefault("noLocation", this.noLocation);
    else
      Session.setDefault("noLocation", true);
    return Session.get("noLocation");
  }
});

Template.editCourseLogistics.events({
  'click #saveEditCourseLogistics': function (event, template) {
    var noLocation = template.find("#editCourseNoLocation").checked;
    modifier = {_id: this._id,
                owner: this.owner,
                noLocation: noLocation }
    if (noLocation) {
      saveUpdates(modifier);
    } 
    else {
      var street = template.find("#editCourseStreet").value;
      var streetAdditional = template.find("#editCourseStreetAdditional").value;
      var plz = template.find("#editCoursePLZ").value;
      // var city = template.find("#editCourseCity").value;

      if (! street.length || plz.length < 5) {
        Notifications.error('Fehler!', "Bitte geben Sie ein vollständige Adresse an.", {timeout: 8000});
        return false
      }
      modifier.street = street;
      modifier.streetAdditional = streetAdditional;
      modifier.plz = plz;
      saveUpdates(modifier);
    }
  },
  'change #editCourseNoLocation': function (event) {
    Session.set("noLocation", event.target.checked);
  }
});