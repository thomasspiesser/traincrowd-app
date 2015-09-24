Template.navItemsLeft.helpers({
  langCode: function () {
    return i18n.getLanguage();
  }
});

Template.navItemsLeft.events({
  'click .langSelector': function (event) {
    i18n.setLanguage(event.currentTarget.text);
    Session.setPersistent( 'Language', event.currentTarget.text );
  }
});

Template.navItemsRight.events({
  'click #logout': function () {
    Meteor.logout( function (error) {
      if ( error )
        toastr.error( error.reason );
      else
        Router.go('home');
    });
  }
});