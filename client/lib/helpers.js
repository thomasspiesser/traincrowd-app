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
}, 1000 );

lazysaveUserField = _.debounce( function ( args ) {
  Meteor.call('updateUserSingleField', args, function (error) {
    if (error) 
      toastr.error( error.reason );
    else {
      formFeedbackSaved('#edit-user-'+args.argName, 3000, '#help-text-edit-user-'+args.argName);
    }
  });
}, 1000 );

lazysaveUserField = _.debounce( function ( args ) {
  Meteor.call('updateUserSingleField', args, function (error) {
    if (error) 
      toastr.error( error.reason );
    else {
      formFeedbackSaved('#edit-trainer-'+args.argName, 3000, '#help-text-edit-trainer-'+args.argName);
    }
  });
}, 1000 );

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
  $(helpTextElem).text( inlineMessage ).fadeIn(300);
  toastr.error( topMessage );
};

calcCommision =  function (fee) {
  return parseFloat(fee) / 100 * 18;
};

trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
};

UI.registerHelper('canEdit', function(owner) {
  if (!Meteor.userId())
    return false;
  return owner === Meteor.userId();
});

UI.registerHelper('hoverText', function() {
  return hoverText[ Session.get('showHoverText') ];
});

UI.registerHelper('error', function() {
  return Session.get("createError");
});

UI.registerHelper('username', function(userId) {
	var user = Meteor.users.findOne( userId );
	return displayName(user);
});

