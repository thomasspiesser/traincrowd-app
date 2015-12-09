// show bootstrap modal with mailchimp signup
window.onload = function() {
  // time is set in milliseconds
  if ( typeof Session.get( 'no-show-newsletter-modal' ) === 'undefined' ||
      Session.get( 'no-show-newsletter-modal' ) < 3 ) {
    Meteor.setTimeout( () => { Modal.show('newsletterModal'); }, 30000);
  }
};


var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $( '.navbar' ).outerHeight();

$( window ).scroll( function( event ){
  didScroll = true;
  $( '#scroll-indicator' ).css( 'opacity', 0 );
});

setInterval( function() {
  if ( didScroll ) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  var st = $( this ).scrollTop();

  // Make sure they scroll more than delta
  if( Math.abs( lastScrollTop - st ) <= delta )
    return;

  if ( st > lastScrollTop && st > navbarHeight ){
    $( '.navbar' ).removeClass( 'nav-down' ).addClass( 'nav-up' );
  }
  else {
    if( st + $( window ).height() < $( document ).height() ) {
      $( '.navbar' ).removeClass( 'nav-up' ).addClass( 'nav-down' );
    }
  }
  lastScrollTop = st;
}
