Template.navItemsLeft.helpers({
  langCode: function () {
    return i18n.getLanguage();
  }
});

Template.navItemsLeft.events({
  'click .langSelector': function ( event ) {
    var lang = event.currentTarget.text;
    i18n.setLanguage( lang );
    T9n.setLanguage( lang );
    Session.setPersistent( 'Language', lang );
  }
});

Template.navItemsRight.events({
  'click #logout': function () {
    Meteor.logout( function ( error ) {
      if ( error )
        toastr.error( error.reason );
      else
        Router.go('home');
    });
  }
});