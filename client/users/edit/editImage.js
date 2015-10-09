var uploader = new ReactiveVar();

Template.editImage.helpers({
  isUploading: function () {
    return Boolean(uploader.get());
  }, 
  progress: function () {
    var upload = uploader.get();
    if (upload)
      return Math.round(upload.progress() * 100) || 0;
  }
});

Template.editImage.events({
  'click #edit-image-dummy': function () {
    $('#edit-image-real').click();
  },
  'change #edit-image-real': function (event, template) {
    var newImage = template.find("#edit-image-real").files[0];

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
          Meteor.call('updateSingleUserField', { id: "", argName: 'imageId', argValue: encodeURI( downloadUrl ) }, function (error) {
            if (error) 
              toastr.error( error.reason );
          });
        }
      });
    }

    uploader.set(upload);
  }
});