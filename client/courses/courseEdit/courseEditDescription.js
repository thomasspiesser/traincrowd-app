Template.editCourseDescription.rendered = function () {
  var categories = Categories.findOne();
  if (categories) {
    $('#edit-course-categories').select2({
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

var lazysaveCourseTitle = _.debounce( function ( args ) {
  Meteor.call('updateCourseSingleField', args, function (error) {
    if (error)
      toastr.error( error.reason );
    else {
      Router.go('course.edit', {slug:slugify( args.argValue )} );
      _.delay( function () {
        $('#edit-course-title').parent().removeClass('has-error').addClass('has-success');
        $('#help-text-edit-course-title').text('gespeichert');
      }, 1000);
      _.delay( function () {
        $('#edit-course-title').parent().removeClass('has-success');
        $('#help-text-edit-course-title').text('');
      }, 4000);
      }
  });
}, 3000 );

var lazysaveCategories = _.debounce( function ( args ) {
  Meteor.call('updateCategories', args, function (error) {
    if (error)
      toastr.error( error.reason );
  });
}, 3000 );

Template.editCourseDescription.events({
  'input #edit-course-title': function (event, template) {
    $('#edit-course-title').parent().removeClass('has-error');
    $('#help-text-edit-course-title').text('speichern...').fadeIn(300);
    lazysaveCourseTitle( {id: this._id, argName: 'title', argValue: event.currentTarget.value.trim()} );
  },
  'input #edit-course-description': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-course-'+field).parent().removeClass('has-error');
    $('#help-text-edit-course-'+field).text('speichern...').fadeIn(300);
    lazysaveCourseField( { id: this._id, argName: field, argValue: event.currentTarget.value } );
  },
  'change #edit-course-categories': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-course-'+field).parent().removeClass('has-error');
    $('#help-text-edit-course-'+field).text('speichern...').fadeIn(300);
    var categories = event.currentTarget.value.split(',');
    categories = _.without(categories, "", " ");
    lazysaveCourseField( {id: this._id, argName: field, argValue: categories} );
    lazysaveCategories( categories );
  },
  'click #saveEditCourseDescription': function (event, template) {
    if (! this.title || ! this.title.length ) {
      formFeedbackError( '#edit-course-title', '#help-text-edit-course-title', 'Bitte tragen Sie hier den Kurstitel ein.', "Der Kurs braucht einen Titel." );
      return false;
    }

    var categories = _.without(this.categories, "", " ");
    if (! categories.length ) {
      formFeedbackError( '#edit-course-categories', '#help-text-course-categories', 'Ordnen Sie Ihren Kurs bitte mindestens einer Kategorie zu.', "Bitte geben Sie ein Kurskategorie an." );
      return false;
    }

    if (! this.description || ! this.description.length ) {
      formFeedbackError( '#edit-course-description', '#help-text-course-description', 'Bitte geben Sie hier eine Kurzbeschreibung für Ihren Kurs ein.', "Dem Kurs fehlt eine Kurzbeschreibung." );
      return false;
    }
    
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