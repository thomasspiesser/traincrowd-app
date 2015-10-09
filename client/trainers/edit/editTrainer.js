Template.editTrainer.created = function () {
  Session.set( "editTrainerTemplate", "editTrainerProfile" );
};

Template.editTrainer.helpers({
  deservesCheckTrainerProfile: function () {
    return this.profile.title && this.profile.name && this.profile.description && this.profile.languages && this.profile.certificates ? true : false;
  },
  deservesCheckTrainerAddress: function () {
    return this.profile.phone && this.profile.mobile && this.profile.billingAddresses[0].street && this.profile.billingAddresses[0].streetNumber && this.profile.billingAddresses[0].plz && this.profile.billingAddresses[0].city ? true : false;
  },
  deservesCheckTrainerAccount: function () {
    return this.emails[0].address ? true : false;
  },
  active: function() {
    return Session.get('editTrainerTemplate');
  }
});

Template.editTrainer.events({ 
  'click .dynamic-template-selector': function ( event ) {
    Session.set( 'editTrainerTemplate', event.currentTarget.id) ;

    $( '.dynamic-template-selector' ).parent().removeClass('active');
    $( event.currentTarget ).parent().addClass('active');
  }
});