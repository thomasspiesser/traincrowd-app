var getText = function(id) {
  var text;
  switch (id) {
    case 'editTrainerProfileShortDescription':
      text = "Geht aus Ihrer Beschreibung klar hervor, was Ihr Alleinstellungsmerkmal gegenüber anderen Anbietern ist? Was macht Sie für Ihre Kunden interessant? Sind Sie eher Spezialist oder Generalist? So zutreffend, haben Sie spezielle Branchenerfahrung erwähnt?";
      return text;
    // case 'editTrainerProfileImage':
    //   text = Fake.paragraph(6);
    //   return text;
    // case 'editTrainerProfileDefaultImage':
    //   text = Fake.paragraph(6);
    //   return text;
    case 'editTrainerProfilePhone': 
      text = "Bitte geben Sie Ihre Telefonnummer samt Städtevorwahl an. Wir geben ihre Telefonnummern natürlich nicht weiter.";
      return text;
    case 'editTrainerProfileMobile':
      text = "Helfen Sie uns Sie zu erreichen, falls z.B. Teilnehmer  Räumlichkeiten nicht finden oder ähnliches. Wir geben ihre Telefonnummern natürlich nicht weiter.";
      return text;
    case 'editTrainerProfileLanguages': 
      text = "Viele Teilnehmer sind an Weiterbildung auf Englisch, Spanisch und anderen Sprachen interessiert. Bitte geben Sie die Sprachen an, in denen sie Ihre Kurse anbieten. Trennen sie die Sprachen durch Kommata.";
      return text;
    case 'editTrainerProfileCertificates':
      text = "Hier können Sie Zertifikate Auswahl Ihrer Referenzen angeben.";
      return text;
    default:
      text = "";
      return text;
  }
};

Template.editTrainerProfile.helpers({
  showHoverText: function () {
    return getText(Session.get( 'showHoverText' ));
  }
});

Template.editTrainerProfile.events({ 
  'click #showProfileButton': function () {
    Router.go("trainerProfile.show", {_id: this._id} );
  }
});

//////////// local functions /////////

var saveUpdates = function (modifier) {
  Meteor.call('updateUser', modifier, function (error, result) {
    if (error)
      toastr.error( error.reason );
    else
      toastr.success( 'Änderungen gespeichert.' );
  });
};

//////////// editTrainerProfile DESCRIPTION template /////////

var uploader = new ReactiveVar();

Template.editTrainerProfileDescription.helpers({
  selected: function (one, two) {
    return one === two ? 'selected' : '';
  },
  isUploading: function () {
    return Boolean(uploader.get());
  }, 
  progress: function () {
    var upload = uploader.get();
    if (upload)
      return Math.round(upload.progress() * 100) || 0;
  }
});

Template.editTrainerProfileDescription.events({
  'click #saveEditProfileDescription': function (event, template) {
    var title = template.find("#editTrainerProfileTitle").value;
    var name = template.find("#editTrainerProfileName").value;
    var description = template.find("#editTrainerProfileShortDescription").value;

    var modifier = {'profile.title': title,
                    'profile.name': name,
                    'profile.description': description }
    saveUpdates(modifier);

    return false;
  },
  'click #newProfileImageDummy': function () {
    $('#newProfileImageReal').click();
  },
  'change #newProfileImageReal': function (event, template) {
    var newImage = template.find("#newProfileImageReal").files[0];

    var upload = new Slingshot.Upload("profilePicture");

    // if (!newImage.type.match('image.*')) {
    //   toastr.error( "Das ist keine Bilddatei." );
    //   return false;
    // }

    // var maxSize = 500000 // in byte, e.g. 20000 is 20KB
    // if (newImage.size > maxSize) {
    //   toastr.error( "Die Bilddatei ist zu groß. Bitte wählen Sie eine Bilddatei, die kleiner als "+ maxSize / 1000 +" KB ist." );
    //   return false;
    // }

    var self = this;

    if (newImage) {
      upload.send(newImage, function (error, downloadUrl) {
        uploader.set();
        if (error) {
          console.log(error)
          toastr.error( error.message );
        }
        else {
          var modifier = {'profile.imageId': downloadUrl}
          saveUpdates(modifier);
        }
      });
    }

    uploader.set(upload);

    // var reader = new FileReader();
    // reader.readAsDataURL(newImage);

    // reader.onloadstart = function(e) {
    //   $('#newProfileImageDummy i').removeClass('fa-upload');
    //   $('#newProfileImageDummy i').addClass('fa-refresh fa-spin');
    //   $('#newProfileImageDummy span').text(' Läd...');
    // };

    // reader.onloadend = function(e) {
    //   $('#newProfileImageDummy i').addClass('fa-upload');
    //   $('#newProfileImageDummy i').removeClass('fa-refresh fa-spin');
    //   $('#newProfileImageDummy span').text(' Neues Bild');
    // };

    // reader.onload = function(event) {
    //   // $('#newProfileImageDummy i').button('reset') 
    //   if (self.profile.imageId) {
    //     var modifier = {_id: self.profile.imageId,
    //                     data: event.target.result }
    //     Meteor.call('updateImage', modifier, function (error, result) {
    //       if (error)
    //         toastr.error( error.reason );
    //     });
    //   } 
    //   else {
    //     Meteor.call('insertImage', event.target.result, function (error, imageId) {
    //       if (error)
    //         toastr.error( error.reason );
    //       else {
    //         var modifier = {'profile.imageId': imageId}
    //         saveUpdates(modifier);
    //       }
    //     });
    //   }
    // };
    // return false;
  },
  'click #deleteProfileImage': function () {
    if (! this.profile.imageId) //if there is nothing to delete
      return false;
    var self = this; // needed, coz this in bootbox is bootbox object
    bootbox.confirm('Bild löschen?', function(result) {
      if (result) {
        var modifier = { 'profile.imageId': '' };
        saveUpdates(modifier);
        Meteor.call('removeImage', self.profile.imageId, function (error, result) {
          if (error)
            toastr.error( error.reason );
        });
      }
    });
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
});

//////////// editTrainerProfile CONTACT template /////////

var autocomplete = function() {
  var DOMelement = $('#google-autocomplete')[0];
  var autocomplete = new google.maps.places.Autocomplete(
    ( DOMelement ), { types: ['geocode'] }
  );
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    fillInAddress( autocomplete.getPlace() );
  });
};

var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  // locality: 'long_name',
  administrative_area_level_1: 'short_name',
  postal_code: 'short_name'
};

var fillInAddress = function (place) {
  //clean form:
  for (var component in componentForm) {
    document.getElementById(component).value = '';
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
};

Template.editTrainerProfileContact.events({
  'click #saveEditProfileContact': function (event, template) {
    var homepage = template.find('#editTrainerProfileHomepage').value;
    var videoURL = template.find('#editTrainerProfileVideo').value;
    var phone = template.find("#editTrainerProfilePhone").value;
    var mobile = template.find("#editTrainerProfileMobile").value;
    var street = template.find("#route").value;
    var street_number = template.find("#street_number").value;
    var streetAdditional = template.find("#editTrainerProfileStreetAdditional").value;
    var plz = template.find("#postal_code").value;
    var city = template.find("#administrative_area_level_1").value;

    if (! street.length || ! street_number.length || plz.length < 4 || ! city.length ) {
      toastr.error( "Bitte geben Sie ein vollständige Adresse an." );
      return false;
    }
    
    var modifier = {'profile.homepage': homepage,
                    'profile.videoURL': videoURL,
                    'profile.phone': phone,
                    'profile.mobile': mobile,
                    'profile.street': street,
                    'profile.streetNumber': street_number,
                    'profile.streetAdditional': streetAdditional,
                    'profile.plz': plz,
                    'profile.city': city };
    
    var re = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;

    if ( videoURL.length ) { 
      var videoId = videoURL.replace( re, '$1' );
      modifier['profile.videoId'] = videoId;
    }

    saveUpdates(modifier);
  },
  'focus #google-autocomplete': function () {
    autocomplete();
  },
  'submit #google-autocomplete-form': function (event) {
    event.preventDefault();
    google.maps.event.trigger(autocomplete, 'place_changed');
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
});

//////////// editTrainerProfile QUALIFICATION template /////////

Template.editTrainerProfileQualification.events({
  'click #saveEditProfileQualification': function (event, template) {
    var languages = template.find("#editTrainerProfileLanguages").value;
    var certificates = template.find("#editTrainerProfileCertificates").value;
    // var experienceGeneral = template.find("#editTrainerProfileExperienceGeneral").value;
    // var experienceTrainer = template.find("#editTrainerProfileExperienceTrainer").value;

    var modifier = {'profile.languages': languages,
                    // 'profile.experienceGeneral': experienceGeneral,
                    // 'profile.experienceTrainer': experienceTrainer, 
                    'profile.certificates': certificates
                  };

    saveUpdates(modifier);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
});

//////////// editTrainerProfile ACCOUNT template /////////

Template.editTrainerProfileAccount.helpers({
  email: function () {
    return Meteor.user().emails[0].address;
  }
});

Template.editTrainerProfileAccount.events({
  'click #saveEditProfileAccount': function (event, template) {
    var email = template.find("#editTrainerProfileEmail").value;
    var passwordNew = template.find("#editTrainerProfilePasswordNew").value;
    var passwordNewAgain = template.find("#editTrainerProfilePasswordNewAgain").value;
    var passwordOld = template.find("#editTrainerProfilePasswordOld").value;

    if (! EMAIL_REGEX.test(email)) {
      toastr.error( "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben." );
      return false;
    } 

    if (passwordNew.length && passwordNew !== passwordNewAgain) {
      toastr.error( "Bitte überprüfen Sie, ob Sie tatsächlich zweimal das gleich Passwort eingegeben haben." );
      $('#editTrainerProfilePasswordNew').val('');
      $('#editTrainerProfilePasswordNewAgain').val('');
      $('#editTrainerProfilePasswordOld').val('');
      return false;
    }

    var modifier = { email: email };
    saveUpdates(modifier);

    if (passwordNew.length) {
      Accounts.changePassword(passwordOld, passwordNew, function (error, result) {
        if (error) {
          toastr.error( error.reason );
          $('#editTrainerProfilePasswordNew').val('');
          $('#editTrainerProfilePasswordNewAgain').val('');
          $('#editTrainerProfilePasswordOld').val('');
          return false;
        }
        else {
          toastr.success( "Passwort geändert." );
          $('#editTrainerProfilePasswordNew').val('');
          $('#editTrainerProfilePasswordNewAgain').val('');
          $('#editTrainerProfilePasswordOld').val('');
          return false;
        }
      });
    }
  },
  'click #deleteMyAccount': function () {
    if (confirm('Benutzer Konto wirklich löschen? \nDiese Aktion kann nicht rückgängig gemacht werden.') ) {
      Meteor.call('deleteMyAccount', function (error, result) {
        if (error) {
          toastr.error( error.reason );
        }
        else {
          Router.go('home');
        }
      });
    }
  }
});