Template.home.onRendered( function() {
  let originalPlaceholder = $('#home-search-form').find('input[type=text]')
    .attr('placeholder');
  function checkWidth() {
    if ( $( window ).width() < 992 ) {
      $( '#home-search-form' ).find( 'input[type=text]' )
        .attr( 'placeholder', i18n('search.short') );
    } else {
      $( '#home-search-form' ).find( 'input[type=text]' )
        .attr( 'placeholder', originalPlaceholder );
    }
  }
  checkWidth();
  $( window ).resize( checkWidth );
  $( '.wow' ).addClass( 'invisible' ).viewportChecker({
    classToAdd: 'visible animated fadeInLeft',
    classToRemove: 'invisible',
  });
});

Template.home.events({
  'submit #home-search-form'( event ) {
    event.preventDefault();
    let searchtext = event.target.searchBox.value;
    Router.go( 'search.course', {}, { query: 'q=' + searchtext } );
  },
});
