Template.home.onRendered(function() {
  var originalPlaceholder = ($('#home-search-form').find("input[type=text]").attr("placeholder"));
  function checkWidth() {
    if ( $( window ).width() < 992 ) {
      $( '#home-search-form' ).find( "input[type=text]" ).attr( "placeholder", i18n('search.short') );
    } else {
      $( '#home-search-form' ).find( "input[type=text]" ).attr( "placeholder", originalPlaceholder );
    }
  }
  checkWidth();
  $( window ).resize( checkWidth );
  $('.wow').addClass('invisible').viewportChecker({
    classToAdd: 'visible animated fadeInLeft',
    classToRemove: 'invisible'
  });
  $('.wow2').addClass('invisible').viewportChecker({
    classToAdd: 'visible animated fadeInUp',
    classToRemove: 'invisible'
  });
});

Template.home.events({
  'submit #home-search-form': function ( event ) {
    event.preventDefault();
    var searchtext = event.target.searchBox.value;
    Router.go( 'search.course', {}, { query: 'q='+searchtext } );
  }
});
