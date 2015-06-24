Template.bookCourseAddress.helpers({
  billingAddresses: function (argument) {
    var user = Meteor.user();
    if ( user ) {
      return _.map( user.profile.billingAddresses, function( a, index ) {
        a._index = index;
        return a;
      });
    }
    return [];
  },
  showNewBillingAddress: function (argument) {
    var user = Meteor.user();
    if ( user )
      return user.profile.billingAddresses.length < 4 ? true : false;
    return false;
  }
});

Template.bookCourseAddress.events({
  'click .edit-billing-address-button': function (event) {
    var selectedBillingAddress = parseInt( event.currentTarget.id );
    var self = this;
    Meteor.call('updateSelectedBillingAddress', selectedBillingAddress, function (error, result) {
      if (error)
        toastr.error( error.reason );
      else
        Modal.show('editAddressModal', self);
    });
  },
  'click #new-billing-address-button': function () {
    var user = Meteor.user();
    var count;
    if ( user )
      count = user.profile.billingAddresses.length;
    else
      return false;
    if ( count >= 4 ) {
      toastr.error( 'Sie dürfen nur 4 Rechnungsadressen anlegen' );
      return false;
    }
    var self = this;
    Meteor.call('updateSelectedBillingAddress', count, function (error, result) {
      if (error)
        toastr.error( error.reason );
      else
        Modal.show('editAddressModal', self);
    });
    
  },
  'change input:radio[name=book-course-address-radio]': function (event) {
    Session.set("bookCourseAddress", event.currentTarget.id);
  }
});