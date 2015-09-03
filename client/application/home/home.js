Template.home.onRendered(function() {
  var originalPlaceholder = ($('#home-search-form').find("input[type=text]").attr("placeholder"));
  function checkWidth() {
    if ( $( window ).width() < 992 ) {
      $( '#home-search-form' ).find( "input[type=text]" ).attr( "placeholder", "Suchen..." );
    } else {
      $( '#home-search-form' ).find( "input[type=text]" ).attr( "placeholder", originalPlaceholder );
    }
  }
  checkWidth();
  $( window ).resize( checkWidth );
});

Template.home.events({
  'submit #home-search-form': function ( event ) {
    event.preventDefault();
    var searchtext = event.target.searchBox.value;
    Router.go( 'search.course', {}, { query: 'q='+searchtext } );
  }
});