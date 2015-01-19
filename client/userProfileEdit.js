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