Template.home.events({
  'submit #home-search-form': function (event) {
    event.preventDefault();
    var searchtext = event.target.searchBox.value;
    Router.go( 'search.course', {}, { query: 'q='+searchtext } );
  }
});

Template.home.onRendered(function() {
});
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('.navbar').outerHeight();

  $(window).scroll(function(event){
      didScroll = true;
  });

  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);

  function hasScrolled() {
      var st = $(this).scrollTop();

      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta)
          return;

      if (st > lastScrollTop && st > navbarHeight){
          $('.navbar').removeClass('nav-down').addClass('nav-up');
      } else {
          if(st + $(window).height() < $(document).height()) {
              $('.navbar').removeClass('nav-up').addClass('nav-down');
          }
      }
      lastScrollTop = st;
  }
