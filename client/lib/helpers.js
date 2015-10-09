//////////// global helper functions /////////

// var varible -> file scope
// varible -> project scope

lazysaveField = _.debounce( function ( collection, args ) {
  Meteor.call('updateSingle'+collection+'Field', args, function ( error ) {
    if ( error ) {
      toastr.error( error.reason || error.message );
    }
    else {
      formFeedbackSaved('#edit-'+args.argName, 3000, '#help-text-edit-'+args.argName);
    }
  });
}, 1000 );

lazysaveCourseField = _.debounce( function ( args ) {
  Meteor.call('updateSingleCourseField', args, function ( error ) {
    if ( error ) {
      toastr.error( error.reason || error.message );
    }
    else {
      formFeedbackSaved('#edit-course-'+args.argName, 3000, '#help-text-edit-course-'+args.argName);
    }
  });
}, 1000 );

lazysaveUserField = _.debounce( function ( args ) {
  Meteor.call('updateSingleUserField', args, function ( error ) {
    if ( error ) {
      toastr.error( error.reason || error.message );
    }
    else {
      formFeedbackSaved('#edit-user-'+args.argName, 3000, '#help-text-edit-user-'+args.argName);
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

hoverCheckEvents = {
  'mouseover .hoverCheck': function (event) {
    Session.set('showHoverText', event.currentTarget.id); 
  },
  'mouseout .hoverCheck': function () {
    Session.set('showHoverText', ""); 
  }
};

UI.registerHelper('i18nOrder', function( arg1, arg2 ) {
  return i18n('ordering', i18n( arg1 ), i18n( arg2 ));
});

UI.registerHelper('hoverText', function() {
  return hoverText[ Session.get('showHoverText') ];
});

UI.registerHelper('niceDate', function() {
  return moment( this ).format( "DD.MM.YYYY" );
});

UI.registerHelper('selected', function(one, two) {
  return one === two ? 'selected' : '';
});

UI.registerHelper('username', function(userId) {
	var user = Meteor.users.findOne( userId );
	return displayName( user );
});

UI.registerHelper('useremail', function(userId) {
  var user = Meteor.users.findOne( userId );
  return displayEmail( user );
});