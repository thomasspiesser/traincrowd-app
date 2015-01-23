var getText = function(id) {
  var text;
  switch (id) {
    case 'editProfileName': 
      text = Fake.paragraph(4);
      return text;
      break;
    case 'editProfileShortDescription':
      text = "Geht aus Ihrer Beschreibung klar hervor, was Ihr Alleinstellungsmerkmal gegenüber anderen Anbietern ist? Was macht Sie für Ihre Kunden interessant? Sind Sie eher Spezialist oder Generalist? So zutreffend, haben Sie spezielle Branchenerfahrung erwähnt?"
      return text;
      break;
    case 'editProfileImage':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editProfileDefaultImage':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editProfilePhone': 
    case 'editProfileStreet':
    case 'editProfileMobile':
    case 'editProfileStreetAdditional':
    case 'editProfilePLZ':
    case 'editProfileCity':
      text = Fake.paragraph(4);
      return text;
      break;

    case 'editProfileLanguages': 
      text = Fake.paragraph(4);
      return text;
      break;
    case 'editProfileCertificates':
      text = Fake.paragraph(6);
      return text;
      break;
    case 'editProfileExperienceGeneral':
    case 'editProfileExperienceTrainer':
      text = Fake.paragraph(6);
      return text;
      break;
    default:
      text = "";
      return text;
  }
}

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
      Notifications.error('Fehler!', error, {timeout: 8000});
    else
      Notifications.info('', 'Änderungen gespeichert.', {timeout: 8000});
  });
}

//////////// editUserProfile DESCRIPTION template /////////

Template.editProfileDescription.helpers({
  selected: function (one, two) {
    return one === two ? 'selected' : '';
  }
});

Template.editProfileDescription.events({
  'click #saveEditProfileDescription': function (event, template) {
    var title = template.find("#editProfileTitle").value;
    var name = template.find("#editProfileName").value;
    var description = template.find("#editProfileShortDescription").value;
    var newImage = template.find("#newProfileImageReal").files[0];

    var modifier = {'profile.title': title,
                    'profile.name': name,
                    'profile.description': description }
    saveUpdates(modifier);

    if (newImage) {
      var self = this; // needed, coz this is fileReader object
      var reader = new FileReader();
      reader.onload = function(event) {
        if (self.profile.imageId) {
          var modifier = {_id: self.profile.imageId,
                          data: event.target.result }
          Meteor.call('updateImage', modifier, function (error, result) {
            if (error)
              Notifications.error('Fehler!', error, {timeout: 8000});
          });
        } 
        else {
          Meteor.call('insertImage', event.target.result, function (error, imageId) {
            if (error)
              Notifications.error('Fehler!', error, {timeout: 8000});
            else {
              var modifier = {'profile.imageId': imageId}
              saveUpdates(modifier);
            }
          });
        }
      };
      reader.readAsDataURL(newImage);
    }
  },
  'click #newProfileImageDummy': function () {
    $('#newProfileImageReal').click();
  },
  'click #deleteProfileImage': function () {
    if (! this.profile.imageId) //if there is nothing to delete
      return false;
    var self = this; // needed, coz this in bootbox is bootbox object
    bootbox.confirm('Bild löschen?', function(result) {
      if (result) {
        var modifier = { 'profile.imageId': '' }
        saveUpdates(modifier);
        Meteor.call('removeImage', self.profile.imageId, function (error, result) {
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

//////////// editUserProfile CONTACT template /////////

Template.editProfileContact.events({
  'click #saveEditProfileContact': function (event, template) {
    var phone = template.find("#editProfilePhone").value;
    var mobile = template.find("#editProfileMobile").value;
    var street = template.find("#editProfileStreet").value;
    var streetAdditional = template.find("#editProfileStreetAdditional").value;
    var plz = template.find("#editProfilePLZ").value;
    // var city = template.find("#editProfileCity").value;

    var modifier = {'profile.phone': phone,
                    'profile.mobile': mobile,
                    'profile.street': street,
                    'profile.streetAdditional': streetAdditional,
                    'profile.plz': plz }

    if (! street.length || plz.length < 5) {
      Notifications.error('Fehler!', "Bitte geben Sie ein vollständige Adresse an.", {timeout: 8000});
      return false;
    }
    saveUpdates(modifier);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  }
});

//////////// editUserProfile QUALIFICATION template /////////

Template.editProfileQualification.events({
  'click #saveEditProfileQualification': function (event, template) {
    var languages = template.find("#editProfileLanguages").value;
    var certificates = template.find("#editProfileCertificates").value;
    var experienceGeneral = template.find("#editProfileExperienceGeneral").value;
    var experienceTrainer = template.find("#editProfileExperienceTrainer").value;

    var modifier = {'profile.languages': languages,
                    'profile.certificates': certificates,
                    'profile.experienceGeneral': experienceGeneral,
                    'profile.experienceTrainer': experienceTrainer }

    saveUpdates(modifier);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
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
                    'profile.workExperience': workExperience }

    saveUpdates(modifier);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
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
      Notifications.error('Fehler!', "Bitte machen Sie überall angaben.", {timeout: 8000});
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
                    'profile.allowNewsletter': allowNewsletter }

    saveUpdates(modifier);
  },
  'change #editProfileAllowNewsletter': function (event) {
    Session.set("allowNewsletter", event.target.checked);
  },
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
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
      Notifications.error('Fehler!', "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben.", {timeout: 8000});
      return false;
    } 

    if (passwordNew.length && passwordNew !== passwordNewAgain) {
      Notifications.error('Änderung Fehlgeschlagen!', "Bitte überprüfen Sie, ob Sie tatsächlich zweimal das gleich Passwort eingegeben haben.", {timeout: 8000});
      $('#editProfilePasswordNew').val('');
      $('#editProfilePasswordNewAgain').val('');
      $('#editProfilePasswordOld').val('');
      return false;
    }

    var modifier = { email: email }
    saveUpdates(modifier);

    if (passwordNew.length) {
      Accounts.changePassword(passwordOld, passwordNew, function (error, result) {
        if (error) {
          Notifications.error('Fehler!', error.reason, {timeout: 8000});
          $('#editProfilePasswordNew').val('');
          $('#editProfilePasswordNewAgain').val('');
          $('#editProfilePasswordOld').val('');
          return false;
        }
        else {
          Notifications.info('', "Passwort geändert.", {timeout: 8000});
          $('#editProfilePasswordNew').val('');
          $('#editProfilePasswordNewAgain').val('');
          $('#editProfilePasswordOld').val('');
          return false;
        }
      });
    }
  }
});