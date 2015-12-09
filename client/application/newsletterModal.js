// show the newsletter-modal three times then no more

Template.newsletterModal.onDestroyed( function() {
  // for first time visitors set to 1, else count up:
  let count = Session.get( 'no-show-newsletter-modal' ) || 0;
  count++;
  Session.setPersistent( 'no-show-newsletter-modal', count );
});

Template.newsletterModal.events({
  'click #mc-embedded-subscribe'() {
    // if they subscribe set to something above 3
    Session.setPersistent( 'no-show-newsletter-modal', 5 );
    Modal.hide( 'newsletterModal' );
  },
});
