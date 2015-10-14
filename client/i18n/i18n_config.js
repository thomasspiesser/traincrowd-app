Meteor.startup(function() {
  var lang;
  if ( Session.get( 'Language' ) )
    lang = Session.get( 'Language' );
  else {
    // detect the language used by the browser, e.g. en-us or de-de
    lang = window.navigator.userLanguage || window.navigator.language;
    lang = lang.split('-')[0];
    if ( lang !== 'de' && lang !== 'en' ) 
      lang = 'de'; // our default in case we don't have tansl for this language
  }
  i18n.setLanguage( lang );
});