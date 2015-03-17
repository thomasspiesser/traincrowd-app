var getText = function(id) {
  var text;
  switch (id) {
    // case 'editProfileName': 
    //   text = Fake.paragraph(4);
    //   return text;
    //   break;
    case 'editProfileShortDescription':
      text = "Geht aus Ihrer Beschreibung klar hervor, was Ihr Alleinstellungsmerkmal gegenüber anderen Anbietern ist? Was macht Sie für Ihre Kunden interessant? Sind Sie eher Spezialist oder Generalist? So zutreffend, haben Sie spezielle Branchenerfahrung erwähnt?"
      return text;
      break;
    // case 'editProfileImage':
    //   text = Fake.paragraph(6);
    //   return text;
    //   break;
    // case 'editProfileDefaultImage':
    //   text = Fake.paragraph(6);
    //   return text;
    //   break;
    case 'editProfilePhone': 
      text = "Bitte geben Sie Ihre Telefonnummer samt Städtevorwahl an. Wir geben ihre Telefonnummern natürlich nicht weiter.";
      return text;
      break;
    case 'editProfileStreet':
    case 'editProfileStreetAdditional':
      text = "Wenn Sie möchten, dass Ihre Anschrift oder die ihrer Firma auf ihrem Profil angezeigt wird geben Sie bitte ihre Adressdaten ein. Wieso? Teilnehmer möchten evtl. nachschauen, wo Sie zu finden sind...";
      return text;
      break;
    case 'editProfileMobile':
      text = "Wir benötigen Ihre Handynummer, damit wir Sie erreichen können, wenn sich Teilnehmer wegen eines Ihrer Kurse an uns wenden - z.B. weil Sie die Räumlichkeiten nicht finden oder ähnliches. Wir geben ihre Telefonnummern natürlich nicht weiter.";
      return text;
      break;
    case 'editProfilePLZ':
    case 'editProfileCity':
      text = "Teilnehmer suchen Weiterbildungen in ihrer Nähe. Damit Sie unsere Such-funktion Sie auch über örtliche Angaben findet geben Sie bitte ihre PLZ und Stadt ein. ";
      return text;
      break;
    case 'editProfileLanguages': 
      text = "Viele Teilnehmer sind an Weiterbildung auf Englisch, Spanisch und anderen Sprachen interessiert. Bitte geben Sie die Sprachen an, in denen sie Ihre Kurse anbieten. Trennen sie die Sprachen durch Kommata.";
      return text;
      break;
    case 'editProfileCertificates':
      text = "";
      return text;
      break;
    default:
      text = "";
      return text;
  }
};

Template.editUserProfile.helpers({
  showHoverText: function () {
    return getText(Session.get( 'showHoverText' ));
  }
});

Template.editUserProfile.events({ 
  'click #showProfileButton': function () {
    Router.go("userProfile.show", {_id: this._id} );
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
}

//////////// editUserProfile DESCRIPTION template /////////

var uploader = new ReactiveVar();

Template.editProfileDescription.helpers({
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

Template.editProfileDescription.events({
  'click #saveEditProfileDescription': function (event, template) {
    var title = template.find("#editProfileTitle").value;
    var name = template.find("#editProfileName").value;
    var description = template.find("#editProfileShortDescription").value;

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

//////////// editUserProfile CONTACT template /////////

Template.editProfileContact.events({
  'click #saveEditProfileContact': function (event, template) {
    var homepage = template.find('#editProfileHomepage').value;
    var phone = template.find("#editProfilePhone").value;
    var mobile = template.find("#editProfileMobile").value;
    var street = template.find("#editProfileStreet").value;
    var streetAdditional = template.find("#editProfileStreetAdditional").value;
    var plz = template.find("#editProfilePLZ").value;
    var city = template.find("#editProfileCity").value;

    if (! street.length || ! city.length || plz.length < 5) {
      toastr.error( "Bitte geben Sie ein vollständige Adresse an." );
      return false;
    }
    
    var modifier = {'profile.homepage': homepage,
                    'profile.phone': phone,
                    'profile.mobile': mobile,
                    'profile.street': street,
                    'profile.streetAdditional': streetAdditional,
                    'profile.plz': plz,
                    'profile.city': city };

    saveUpdates(modifier);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
});

//////////// editUserProfile QUALIFICATION template /////////

Template.editProfileQualification.events({
  'click #saveEditProfileQualification': function (event, template) {
    var languages = template.find("#editProfileLanguages").value;
    var certificates = template.find("#editProfileCertificates").value;
    // var experienceGeneral = template.find("#editProfileExperienceGeneral").value;
    // var experienceTrainer = template.find("#editProfileExperienceTrainer").value;

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


//////////// editUserProfile OCCUPATION template /////////

Template.editProfileOccupation.rendered = function () {
  $('#editProfileIndustry').select2({
    tags: ['non-profit', 'Start-up', 'Sonstige']
  });
};

Template.editProfileOccupation.helpers({
  selected: function (one, two) {
    return one === two ? 'selected' : '';
  }
});

Template.editProfileOccupation.events({
  'click #saveEditProfileOccupation': function (event, template) {
    var employer = template.find("#editProfileEmployer").value;
    var position = template.find("#editProfilePosition").value;
    var industry = template.find("#editProfileIndustry").value;
    var workExperience = template.find("#editProfileWorkExperience").value;

    var modifier = {'profile.employer': employer,
                    'profile.position': position,
                    'profile.industry': industry,
                    'profile.workExperience': workExperience };

    saveUpdates(modifier);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
});


//////////// editUserProfile EXPECTATION template /////////

Template.editProfileExpectation.rendered = function () {
  var categories = Categories.findOne();
  if (categories) {
    $('#editProfileInterests').select2({
      tags: categories.categories
    });
  }
};

Template.editProfileExpectation.helpers({
  checked: function (one, two) {
    return one === two ? 'checked' : '';
  },
  allowNewsletter: function () {
    if (this.profile && typeof this.profile.allowNewsletter !== 'undefined') 
      Session.setDefault("allowNewsletter", this.profile.allowNewsletter);
    else 
      Session.setDefault("allowNewsletter", false);
    return Session.get("allowNewsletter");
  }
});

Template.editProfileExpectation.events({
  'click #saveEditProfileExpectation': function (event, template) {
    //radio buttons:
    var expectedCommunication = template.find('input:radio[name=expectedCommunication]:checked');
    var expectedAims = template.find('input:radio[name=expectedAims]:checked');
    var expectedMethodQuality = template.find('input:radio[name=expectedMethodQuality]:checked');
    var expectedNeeds = template.find('input:radio[name=expectedNeeds]:checked');
    var expectedSkills = template.find('input:radio[name=expectedSkills]:checked');
    var expectedLogistics = template.find('input:radio[name=expectedLogistics]:checked');

    if (!expectedCommunication || !expectedAims || !expectedMethodQuality || !expectedNeeds || !expectedSkills || !expectedLogistics ) {
      toastr.error( "Bitte machen Sie überall angaben." );
      return false;
    }
    else {
      expectedCommunication = expectedCommunication.value;
      expectedAims = expectedAims.value;
      expectedMethodQuality = expectedMethodQuality.value;
      expectedNeeds = expectedNeeds.value;
      expectedSkills = expectedSkills.value;
      expectedLogistics = expectedLogistics.value;
    }
    var expectedOther = template.find("#editProfileExpectedOther").value;

    var interests = template.find("#editProfileInterests").value;
    var allowNewsletter = template.find("#editProfileAllowNewsletter").checked;

    var modifier = {'profile.expectedCommunication': expectedCommunication,
                    'profile.expectedAims': expectedAims,
                    'profile.expectedMethodQuality': expectedMethodQuality,
                    'profile.expectedNeeds': expectedNeeds,
                    'profile.expectedSkills': expectedSkills,
                    'profile.expectedLogistics': expectedLogistics,
                    'profile.expectedOther': expectedOther,

                    'profile.interests': interests,
                    'profile.allowNewsletter': allowNewsletter };

    saveUpdates(modifier);
  },
  'change #editProfileAllowNewsletter': function (event) {
    Session.set("allowNewsletter", event.target.checked);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
});

//////////// editUserProfile ACCOUNT template /////////

Template.editProfileAccount.helpers({
  email: function () {
    return Meteor.user().emails[0].address;
  }
});

Template.editProfileAccount.events({
  'click #saveEditProfileAccount': function (event, template) {
    var email = template.find("#editProfileEmail").value;
    var passwordNew = template.find("#editProfilePasswordNew").value;
    var passwordNewAgain = template.find("#editProfilePasswordNewAgain").value;
    var passwordOld = template.find("#editProfilePasswordOld").value;

    if (! EMAIL_REGEX.test(email)) {
      toastr.error( "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben." );
      return false;
    } 

    if (passwordNew.length && passwordNew !== passwordNewAgain) {
      toastr.error( "Bitte überprüfen Sie, ob Sie tatsächlich zweimal das gleich Passwort eingegeben haben." );
      $('#editProfilePasswordNew').val('');
      $('#editProfilePasswordNewAgain').val('');
      $('#editProfilePasswordOld').val('');
      return false;
    }

    var modifier = { email: email };
    saveUpdates(modifier);

    if (passwordNew.length) {
      Accounts.changePassword(passwordOld, passwordNew, function (error, result) {
        if (error) {
          toastr.error( error.reason );
          $('#editProfilePasswordNew').val('');
          $('#editProfilePasswordNewAgain').val('');
          $('#editProfilePasswordOld').val('');
          return false;
        }
        else {
          toastr.success( "Passwort geändert." );
          $('#editProfilePasswordNew').val('');
          $('#editProfilePasswordNewAgain').val('');
          $('#editProfilePasswordOld').val('');
          return false;
        }
      });
    }
  },
  'click #deleteMyAccount': function () {
    confirm('Benutzer Konto wirklich löschen? \nDiese Aktion kann nicht rückgängig gemacht werden.', function(result) {
      if (result) {
        Meteor.call('deleteMyAccount', function (error, result) {
          if (error)
            toastr.error( error.reason );
        });
      }
    });
    
  }
});