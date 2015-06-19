var uploader = new ReactiveVar();

Template.editUserProfile.helpers({
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

Template.editUserProfile.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-user-'+field).parent().removeClass('has-error');
    $('#help-text-edit-user-'+field).text('speichern...').fadeIn(300);
    lazysaveUserField( { argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditUserProfile': function (event, template) {
    Session.set('editUserTemplate', "editUserAddress");

    $('#editUserProfile').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editUserAddress').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  },
  'click #edit-user-image-dummy': function () {
    $('#edit-user-image-real').click();
  },
  'change #edit-user-image-real': function (event, template) {
    var newImage = template.find("#edit-user-image-real").files[0];

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
  'mouseover .hoverCheck': function (event, template) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
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