Meteor.startup(function() {
  var lang;
  if ( Session.get( 'Language' ) )
    lang = Session.get( 'Language' );
  else {
    // detect the language used by the browser
    lang = window.navigator.userLanguage || window.navigator.language;
  }
  i18n.setLanguage( lang );
});