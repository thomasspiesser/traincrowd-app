Template.newsletterModal.events({
	'click #mc-embedded-subscribe': function () {
		Modal.hide( 'newsletterModal' );
	},
	'change #no-show-newsletter-modal': function () {
		Session.setPersistent( 'no-show-newsletter-modal', true );
		$( "#no-show-modal-input" ).delay( 1000 ).fadeOut( 'slow', function() {
      $( "#no-show-modal-ok" ).fadeIn( 'slow', function() {
      	Meteor.setTimeout( function () {
      		Modal.hide( 'newsletterModal' );
      	}, 1000);
      });
    });
	}
});