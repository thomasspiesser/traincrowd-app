//////////// global helper functions /////////

// var varible -> file scope
// varible -> project scope

lazysaveCourseField = _.debounce( function ( args ) {
  Meteor.call('updateCourseSingleField', args, function (error) {
    if (error)
      toastr.error( error.reason );
    else {
      formFeedbackSaved('#edit-course-'+args.argName, 3000, '#help-text-edit-course-'+args.argName);
    }
  });
}, 2000 );

formFeedbackSaved = function ( elem, wait, helpTextElem ) {
  $( elem ).parent().removeClass('has-error').addClass('has-success');
  $( helpTextElem ).text('gespeichert');
  _.delay( function () {
    $( elem ).parent().removeClass('has-success');
    $( helpTextElem ).fadeOut(300);
  }, wait );
};

formFeedbackError = function ( elem, helpTextElem, inlineMessage, topMessage ) {
  $( elem ).parent().addClass('has-error');
  $(helpTextElem).text( inlineMessage );
  toastr.error( topMessage );
};

trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
};

EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

UI.registerHelper('canEdit', function(owner) {
  if (!Meteor.userId())
    return false;
  return owner === Meteor.userId();
});

UI.registerHelper('error', function() {
  return Session.get("createError");
});

UI.registerHelper('username', function(userId) {
	var user = Meteor.users.findOne( userId );
	return displayName(user);
});

// UI.registerHelper('image', function(imageId) {
//   var image = Images.findOne({_id: imageId})
//   if (image)
//     return image.data;
//   return false
// });