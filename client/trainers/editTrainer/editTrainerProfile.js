var uploader = new ReactiveVar();

Template.editTrainerProfile.helpers({
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

Template.editTrainerProfile.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-trainer-'+field).parent().removeClass('has-error');
    $('#help-text-edit-trainer-'+field).text('speichern...').fadeIn(300);
    lazysaveUserField( { argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditTrainerProfile': function (event, template) {
    if (! this.profile.name || ! this.profile.name.length ) {
      formFeedbackError( '#edit-trainer-name', '#help-text-edit-trainer-name', 'Bitte tragen Sie hier Ihren Namen ein.', "Sie müssen einen Namen angeben." );
      return false;
    }

    if (! this.profile.description || ! this.profile.description.length ) {
      formFeedbackError( '#edit-trainer-description', '#help-text-edit-trainer-description', 'Bitte tragen Sie hier Ihre Kurzbeschreibung ein.', "Sie müssen eine Kurzbeschreibung angeben." );
      return false;
    }

    Session.set('editTrainerTemplate', "editTrainerAddress");

    $('#editTrainerProfile').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editTrainerAddress').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  },
  'click #edit-trainer-image-dummy': function () {
    $('#edit-trainer-image-real').click();
  },
  'change #edit-trainer-image-real': function (event, template) {
    var newImage = template.find("#edit-trainer-image-real").files[0];

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
          Meteor.call('updateUserSingleField', { argName: 'imageId', argValue: downloadUrl }, function (error) {
            if (error) 
              toastr.error( error.reason );
          });
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

Template.editTrainerProfile.events( hoverCheckEvents );
