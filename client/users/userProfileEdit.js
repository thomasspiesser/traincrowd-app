Template.editUserProfile.events({ 
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

//////////// editUserProfile DESCRIPTION template /////////

var uploader = new ReactiveVar();

Template.editUserProfileDescription.helpers({
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

Template.editUserProfileDescription.events({
  'click #saveEditProfileDescription': function (event, template) {
    var title = template.find("#editUserProfileTitle").value;
    var name = template.find("#editUserProfileName").value;

    var modifier = {'profile.title': title,
                    'profile.name': name };
    saveUpdates(modifier);

    return false;
  },
  'click #newProfileImageDummy': function () {
    $('#newProfileImageReal').click();
  },
  'change #newProfileImageReal': function (event, template) {
    var newImage = template.find("#newProfileImageReal").files[0];

    var upload = new Slingshot.Upload("profilePicture");

    var self = this;

    if (newImage) {
      upload.send(newImage, function (error, downloadUrl) {
        uploader.set();
        if (error) {
          console.log(error);
          toastr.error( error.message );
        }
        else {
          var modifier = {'profile.imageId': downloadUrl};
          saveUpdates(modifier);
        }
      });
    }

    uploader.set(upload);
  },
  // 'click #deleteProfileImage': function () {
  //   if (! this.profile.imageId) //if there is nothing to delete
  //     return false;
  //   var self = this; // needed, coz this in bootbox is bootbox object
  //   bootbox.confirm('Bild löschen?', function(result) {
  //     if (result) {
  //       var modifier = { 'profile.imageId': '' };
  //       saveUpdates(modifier);
  //       Meteor.call('removeImage', self.profile.imageId, function (error, result) {
  //         if (error)
  //           toastr.error( error.reason );
  //       });
  //     }
  //   });
  // }
});

//////////// editUserProfile CONTACT template /////////

Template.editUserProfileContact.events({
  'click #saveEditProfileContact': function (event, template) {
    var phone = template.find("#editUserProfilePhone").value;
    var mobile = template.find("#editUserProfileMobile").value;
    var street = template.find("#editUserProfileStreet").value;
    var streetAdditional = template.find("#editUserProfileStreetAdditional").value;
    var plz = template.find("#editUserProfilePLZ").value;
    var city = template.find("#editUserProfileCity").value;

    if (! street.length || ! city.length || plz.length < 5) {
      toastr.error( "Bitte geben Sie ein vollständige Adresse an." );
      return false;
    }
    
    var modifier = {'profile.phone': phone,
                    'profile.mobile': mobile,
                    'profile.street': street,
                    'profile.streetAdditional': streetAdditional,
                    'profile.plz': plz,
                    'profile.city': city };

    saveUpdates(modifier);
  }
});

//////////// editUserProfile OCCUPATION template /////////

Template.editUserProfileOccupation.helpers({
  selected: function (one, two) {
    return one === two ? 'selected' : '';
  }
});

Template.editUserProfileOccupation.events({
  'click #saveEditProfileOccupation': function (event, template) {
    var employer = template.find("#editUserProfileEmployer").value;
    var position = template.find("#editUserProfilePosition").value;
    var industry = template.find("#editUserProfileIndustry").value;
    var workExperience = template.find("#editUserProfileWorkExperience").value;

    var modifier = {'profile.employer': employer,
                    'profile.position': position,
                    'profile.industry': industry,
                    'profile.workExperience': workExperience };

    saveUpdates(modifier);
  }
});


//////////// editUserProfile EXPECTATION template /////////

Template.editUserProfileExpectation.rendered = function () {
  var categories = Categories.findOne();
  if (categories) {
    $('#editUserProfileInterests').select2({
      tags: categories.categories
    });
  }
};

Template.editUserProfileExpectation.helpers({
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

Template.editUserProfileExpectation.events({
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
    var expectedOther = template.find("#editUserProfileExpectedOther").value;

    var interests = template.find("#editUserProfileInterests").value;
    var allowNewsletter = template.find("#editUserProfileAllowNewsletter").checked;

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
  'change #editUserProfileAllowNewsletter': function (event) {
    Session.set("allowNewsletter", event.target.checked);
  }
});

//////////// editUserProfile ACCOUNT template /////////

Template.editUserProfileAccount.helpers({
  email: function () {
    return Meteor.user().emails[0].address;
  }
});

Template.editUserProfileAccount.events({
  'click #saveEditProfileAccount': function (event, template) {
    var email = template.find("#editUserProfileEmail").value;
    var passwordNew = template.find("#editUserProfilePasswordNew").value;
    var passwordNewAgain = template.find("#editUserProfilePasswordNewAgain").value;
    var passwordOld = template.find("#editUserProfilePasswordOld").value;

    if (! EMAIL_REGEX.test(email)) {
      toastr.error( "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben." );
      return false;
    } 

    if (passwordNew.length && passwordNew !== passwordNewAgain) {
      toastr.error( "Bitte überprüfen Sie, ob Sie tatsächlich zweimal das gleich Passwort eingegeben haben." );
      $('#editUserProfilePasswordNew').val('');
      $('#editUserProfilePasswordNewAgain').val('');
      $('#editUserProfilePasswordOld').val('');
      return false;
    }

    var modifier = { email: email };
    saveUpdates(modifier);

    if (passwordNew.length) {
      Accounts.changePassword(passwordOld, passwordNew, function (error, result) {
        if (error) {
          toastr.error( error.reason );
          $('#editUserProfilePasswordNew').val('');
          $('#editUserProfilePasswordNewAgain').val('');
          $('#editUserProfilePasswordOld').val('');
          return false;
        }
        else {
          toastr.success( "Passwort geändert." );
          $('#editUserProfilePasswordNew').val('');
          $('#editUserProfilePasswordNewAgain').val('');
          $('#editUserProfilePasswordOld').val('');
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