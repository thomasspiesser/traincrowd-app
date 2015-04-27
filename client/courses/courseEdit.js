//////////// editCourse template /////////

var getText = function(id) {
  var text;
  // console.log(id)
  switch (id) {
    case 'editCourseTitle': 
      text = "Beschreibt der Titel den Kursinhalt? Und klingt er zudem auch noch interessant? Potentielle Teilnehmer beurteilen anhand des Kurstitels, ob ein Training relevant für sie ist.";
      return text;
    case 'editCourseShortDescription':
      text = "Sie haben hier die Möglichkeit eine Zusammenfassung für Ihren Kurs anzugeben.";
      return text;
    case 'editCourseImage':
    case 'editCourseDefaultImage':
      text = "Wenn vorhanden, können Sie hier ein Bild für Ihren Kurs hochladen. Wenn Sie kein Bild hochladen, wird automatisch Ihr Profilbild angezeigt.";
      return text;
    case 's2id_editCourseCategories':
      text = "Bitte wählen Sie Kategorien aus, die genau auf Ihren Kurs zutreffen.";
      return text;
    case 'editCourseAims': 
      text = "Ihre Lernziele beschreiben, was durch die Teilnahme an Ihrem Kurs erreicht werden kann.";
      return text;
    case 'editCourseMethods':
      text = "Beschreiben Sie mit Schlagworten, welche Methoden Sie einsetzen, um die angegebenen Lernziele zu erreichen.";
      return text;
    case 'editCourseTargetGroup':
      text = "Welche Berufsgruppen können besonders von Ihrem Kurs profitieren?";
      return text;
    case 'editCoursePrerequisites':
      text = "Soweit zutreffend, geben Sie bitte in Schlagworten an, welche Voraussetzungen Teilnehmer für den Kurs mitbringen müssen.";
      return text;
    case 'editCourseLanguages': 
      text = "Viele Teilnehmer sind an Weiterbildung auf Englisch, Spanisch und anderen Sprachen interessiert. Bitte geben Sie die Sprachen an, in denen Sie diesen Kurs anbieten. Trennen Sie die Sprachen durch Kommata.";
      return text;
    case 'editCourseAdditionalServices':
      text = "Geben Sie hier bitte an, ob Teilnehmer ein Zertifikat o.ä. erhalten und welche weiteren Leistungen (wie Essen, Unterkunft, Snacks, etc.) in dem Kurspreis enthalten sind.";
      return text;
    case 'editCourseMinParticipants':
      text = "Vorsicht: Aus der Mindestteilnehmeranzahl berechnet sich der Preis pro Teilnehmer, der auf der Kursseite angezeigt wird. Je niedriger die Mindestteilnehmeranzahl ist, desto teurer wird der Kurs also für den einzelnen Teilnehmer.";
      return text;
    case 'editCourseMaxParticipants':
      // text = "Geben Sie bitte hier die maximale Anzahl von Teilnehmern für den Kurs an. Wenn mehr Teilnehmer als die Mindestteilnehmeranzahl Ihren Kurs buchen erhalten Sie je Teilnehmer zusätzlich Einnahmen: und zwar den Kurspreis pro Teilnehmer abzüglich der traincrowd Kommission bis die Maximale Gruppengröße erreicht ist.";
      text = "Geben Sie bitte hier die gewünschte Anzahl von Teilnehmern für Ihren Kurs an. Wir informieren Sie, sobald sich die gewünschte Anzahl von Teilnehmern gefunden hat. Sollte diese Teilnehmerzahl zum Stichtag nicht erreicht werden, haben Sie die Option, den Kurs für entsprechend weniger Personen abzuhalten.";
      return text;
    case 'editCourseFee':
      text = "Geben Sie hier Ihr Honorar, inkl. MwSt, für den gesamten Kurs an. traincrowd erhebt auf diesen Preis eine Kommission von 10% plus 5% Servicegebühr zuzüglich MwSt. Aus dem Gesamtpreis und der Teilnehmerzahl ergibt sich der Kurspreis pro Person, der auf der Kursseite angezeigt wird.";
      return text;
    case 'editCourseDuration':
      text = "Bitte runden Sie die Kursdauer auf halbe Tage auf oder ab.";
      return text;
    case 'editCourseDates':
      text = "Geben Sie bitte alle Tage an, an denen der Kurs stattfindet. Speichern Sie, um weitere Termine hinzuzufügen.";
      return text;
    case 'editCourseAllowInquiry':
      text = "";
      return text;
    case 'editCourseExpires':
      text = "Die Vorlaufzeit gibt an, wie viele Wochen im Voraus Sie eine Bestätigung haben wollen, ob genügend Teilnehmer Ihren Kurs gebucht haben. Eine kürzere Vorlaufzeit erlaubt Teilnehmern spontan zu buchen. Eine längere Vorlaufzeit erhöht Ihre Planungssicherheit.";
      return text;
    default:
      text = "";
      return text;
  }
};

Template.editCourse.created = function () {
  Session.set("editCourseTemplate", "editCourseDescription");
};

Template.editCourse.helpers({
  active: function() {
    return Session.get('editCourseTemplate');
  },
  showHoverText: function () {
    return getText(Session.get( 'showHoverText' ));
  }
});

Template.editCourse.events({ 
  'click .dynamic-template-selector': function (event) {
    Session.set('editCourseTemplate', event.currentTarget.id);

    $('.progress-tracker').removeClass('active').addClass('inactive');
    $(event.currentTarget).children('.progress-tracker').removeClass('inactive').addClass('active');
  },
  'click #removeCourseButton': function (event, template) {
    Courses.remove(this._id);
    Router.go("/courses");
  },
  'click #previewCourseButton': function (event, template) {
    Router.go("course.show", {slug: this.slug} );
  }
});

//////////// local functions /////////

var saveUpdates = function (modifier) {
  Meteor.call('updateCourse', modifier, function (error, result) {
    if (error)
      toastr.error( error.reason );
    else
      toastr.success( 'Änderungen gespeichert.' );
  });
};

//////////// editCourse DESCRIPTION template /////////

Template.editCourseDescription.rendered = function () {
  var categories = Categories.findOne();
  if (categories) {
    $('#editCourseCategories').select2({
      tags: categories.categories
    });
  }
};

var uploader = new ReactiveVar();

Template.editCourseDescription.helpers({
  isUploading: function () {
    return Boolean(uploader.get());
  }, 
  progress: function () {
    var upload = uploader.get();
    if (upload)
      return Math.round(upload.progress() * 100) || 0;
  }
  // imageId: function () {
  //   return this.uploader.url(true);
  // }
});

Template.editCourseDescription.events({
  'click #saveEditCourseDescription': function (event, template) {
    var title = template.find("#editCourseTitle").value;
    var description = template.find("#editCourseShortDescription").value;
    var categories = template.find("#editCourseCategories").value.split(',');

    if (! title.length) {
      toastr.error( "Der Kurs braucht einen Titel." );
      return false;
    }

    var modifier = {_id: this._id,
                owner: this.owner,
                title: title,
                description: description,
                categories: categories };
    Meteor.call('updateCourse', modifier, function (error, result) {
      if (error) {
        toastr.error( error.reason );
        return false;
      }
      else {
        Router.go('course.edit', {slug:slugify(title)} );
        toastr.success( 'Änderungen gespeichert.' );
      }
    });

    Meteor.call('updateCategories', categories, function (error, result) {
      if (error)
        toastr.error( error.reason );
    });
    
    Session.set('editCourseTemplate', "editCourseDetails");

    $('#editCourseDescription').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editCourseDetails').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  },
  'click #newCourseImageDummy': function () {
    $('#newCourseImageReal').click();
  },
  'change #newCourseImageReal': function (event, template) {
    var newImage = template.find("#newCourseImageReal").files[0];

    var metaContext = {course: this._id};
    var upload = new Slingshot.Upload("coursePicture", metaContext);

    var self = this;

    if (newImage) {
      upload.send(newImage, function (error, downloadUrl) {
        uploader.set();
        if (error) {
          console.log(error);
          toastr.error( error.message );
        }
        else {
          var modifier = {_id: self._id,
                          owner: self.owner,
                          imageId: downloadUrl};
          saveUpdates(modifier);
        }
      });
    }

    uploader.set(upload);

  },
  // 'click #deleteCourseImage': function () {
  //   if (! this.imageId) //if there is nothing to delete
  //     return false;
  //   var self = this; // needed, coz this in bootbox is bootbox object
  //   bootbox.confirm('Bild löschen?', function(result) {
  //     if (result) {
  //       var modifier = {_id: self._id,
  //                   owner: self.owner,
  //                   imageId: '' }
  //       saveUpdates(modifier);
  //       Meteor.call('removeImage', self.imageId, function (error, result) {
  //         if (error)
  //           toastr.error( error.reason );
  //       });
  //     }
  //   });
  // },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
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
    var additionalServices = template.find("#editCourseAdditionalServices").value;

    var modifier = {_id: this._id,
                owner: this.owner,
                aims: aims,
                methods: methods,
                targetGroup: targetGroup,
                prerequisites: prerequisites,
                languages: languages,
                additionalServices: additionalServices };

    saveUpdates(modifier);

    Session.set('editCourseTemplate', "editCourseCosts");

    $('#editCourseDetails').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editCourseCosts').children('.progress-tracker').removeClass('inactive').addClass('active');
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
});

//////////// editCourse COSTS template /////////

Template.editCourseCosts.rendered = function () {
  if (this.data.fee)
    Session.set("courseFee", this.data.fee);
  else
    Session.set("courseFee", 0);
  if (this.data.maxParticipants)
    Session.set("courseMaxParticipants", this.data.maxParticipants);
  else
    Session.set("courseMaxParticipants", false);
};

Template.editCourseCosts.helpers({
  feePP: function () {
    if (Session.equals("courseMaxParticipants", false) )
      return;
    var commision = +( Session.get("courseFee") / 100 * 15 ).toFixed(2);
    var fee = parseFloat(Session.get("courseFee"));
    return ( ( fee + commision ) / Session.get("courseMaxParticipants") ).toFixed(2);
  },
  serviceFee: function () {
    if (Session.equals("courseMaxParticipants", false) )
      return;
    return ( Session.get("courseFee") / 100 * 15 ).toFixed(2);
  }
});

Template.editCourseCosts.events({
  'click #saveEditCourseCosts': function (event, template) {
    var fee = template.find("#editCourseFee").value;
    // var minParticipants = template.find("#editCourseMinParticipants").value;
    var maxParticipants = template.find("#editCourseMaxParticipants").value;

    if (! fee.length || ! maxParticipants.length) {
      toastr.error( "Sie müssen einen Preis und die Teilnehmerzahl angeben." );
      return false;
    }
    // var minParticipants = parseInt(minParticipants);
    maxParticipants = parseInt(maxParticipants);
    // if (minParticipants > maxParticipants) {
    //   toastr.error( "Die maximale Gruppengröße muss mindestens "+minParticipants+" sein." );
    //   return false
    // }

    fee = parseFloat(fee.replace(',','.'));
    fee = +fee.toFixed(2); // rounded to 2 digits returns number coz of +
    var modifier = {_id: this._id,
                owner: this.owner,
                // minParticipants: minParticipants,
                maxParticipants: maxParticipants,
                fee: fee };
    saveUpdates(modifier);

    Session.set('editCourseTemplate', "editCourseDates");

    $('#editCourseCosts').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editCourseDates').children('.progress-tracker').removeClass('inactive').addClass('active');
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  },
  'input #editCourseFee': function (event, template) {
    Session.set("courseFee", event.currentTarget.value);
  },
  'input #editCourseMaxParticipants': function (event, template) {
    Session.set("courseMaxParticipants", event.currentTarget.value);
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
  };

Template.editCourseDates.rendered=function() {
    $('.editCourseDates').datepicker({
      startDate: "-0d",
      language: "de",
      todayBtn: true,
      multidate: true,
      todayHighlight: true,
      orientation: "top left"
    });
};

Template.editCourseDates.helpers({
  selected: function (one, two) {
    return one === two ? 'selected' : '';
  },
  niceDate: function () {
    return moment(this).format("DD.MM.YYYY");
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
  'click #saveEditCourseDates': function (event, template) {
    var duration = template.find("#editCourseDuration").value;
    var expires = template.find("#editCourseExpires").value;

    if (! duration || ! expires) {
      toastr.error( "Sie müssen angeben wie viele Tage der Kurs dauert und bis wann er vollständig gebucht sein muss." );
      return false;
    }
    duration = parseInt(duration);
    expires = parseInt(expires);
    
    var newEvents = $('#editCourseDatesForm').serializeArray();
    var dates = [];

    if ( newEvents.length > 1 || newEvents[0].value ) {
      for (var i = 0; i < newEvents.length; i++) {
        var datesArray = newEvents[i].value.split(',');
        if (datesArray.length !== duration) {
          var j = i+1;
          toastr.error( "Kursdauer und Anzahl der Kurstage von Terminoption " + j + " stimmen nicht überein." );
          return false;
        }
        var dateObjectsArray = _.map(datesArray, function(date) { return moment(date, "DD.MM.YYYY")._d; } ); // returns the date object - thats what we will store in the DB
        dateObjectsArray.sort(function (a,b) { return a-b; }); // sort dates

        var expiredAt = new Date(+dateObjectsArray[0] - 1000 * 60 * 60 * 24 * 7 * expires);
        if (expiredAt < new Date()) {
          var j = i+1;
          toastr.error( "Terminoption " + j + " ist bereits abgelaufen." );
          return false;
        }

        var options = {course: this._id,
                      owner: this.owner,
                      courseDate: dateObjectsArray };

        Meteor.call('createCurrent', options, function (error, result) {
          if (error)
            toastr.error( error.reason );
          else
            $('.editCourseDates').datepicker('setDate', null);
        });
        dates.push( dateObjectsArray );
      }
      var options = {_id: this._id,
                    dates: dates };
      Meteor.call('addToCourseDates', options, function (error, result) {
        if (error)
          toastr.error( error.reason );
      });
    }
    // var allowInquiry = template.find("#editCourseAllowInquiry").checked;
    var modifier = {_id: this._id,
                owner: this.owner,
                duration: duration,
                // allowInquiry: allowInquiry,
                expires: expires };
    saveUpdates(modifier);

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

//////////// editCourse LOGISTICS template /////////

Template.editCourseLogistics.helpers({
  noLocation: function () {
    if (typeof this.noLocation !== 'undefined')
      Session.setDefault("noLocation", this.noLocation);
    else
      Session.setDefault("noLocation", false);
    return Session.get("noLocation");
  }
});

Template.editCourseLogistics.events({
  'click #saveEditCourseLogistics': function (event, template) {
    var noLocation = template.find("#editCourseNoLocation").checked;
    var modifier = {_id: this._id,
                owner: this.owner,
                noLocation: noLocation };
    if (noLocation) {
      saveUpdates(modifier);
    } 
    else {
      var street = template.find("#route").value;
      var street_number = template.find("#street_number").value;
      var streetAdditional = template.find("#editCourseStreetAdditional").value;
      var plz = template.find("#postal_code").value;
      var city = template.find("#administrative_area_level_1").value;

      if (! street.length || ! street_number.length || plz.length < 5 || ! city.length ) {
        toastr.error( "Bitte geben Sie ein vollständige Adresse an." );
        return false;
      }
      
      modifier.street = street;
      modifier.streetNumber = street_number;
      modifier.streetAdditional = streetAdditional;
      modifier.plz = plz;
      modifier.city = city;

      saveUpdates(modifier);

      // $('#infoModal').modal('show');
    }
  },
  'change #editCourseNoLocation': function (event) {
    Session.set("noLocation", event.target.checked);
  }
});