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
  hasError: function () {
    return true;
  },
  isUploading: function () {
    return Boolean(uploader.get());
  }, 
  progress: function () {
    var upload = uploader.get();
    if (upload)
      return Math.round(upload.progress() * 100) || 0;
  },
  hoverText: function () {
    return courseEditHoverText[ Session.get('showHoverText') ];
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
    categories = _.without(categories, "", " ");

    if (! title.length ) {
      $('#editCourseTitle').parent().addClass('has-error');
      $('#editCourseTitle').next('span').text('Bitte tragen Sie hier den Kurstitel ein.');
      toastr.error( "Der Kurs braucht einen Titel." );
      return false;
    }

    if (! description.length ) {
      $('#editCourseShortDescription').parent().addClass('has-error');
      $('#editCourseShortDescription').next('span').text('Bitte geben Sie hier eine Kurzbeschreibung für Ihren Kurs ein.');
      toastr.error( "Dem Kurs fehlt eine Kurzbeschreibung." );
      return false;
    }

    if (! categories.length ) {
      $('#editCourseCategories').parent().addClass('has-error');
      $('#editCourseCategories').next('span').text('Ordnen Sie Ihren Kurs bitte mindestens einer Kategorie zu.');
      toastr.error( "Bitte geben Sie ein Kurskategorie an." );
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
          Meteor.call('updateCourse', modifier, function (error, result) {
            if (error)
              toastr.error( error.reason );
            else
              toastr.success( 'Änderungen gespeichert.' );
          });
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