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
  },
  plusone: function (argument) {
    return argument + 1;
  },
  checked: function (index) {
    return index === Meteor.user().profile.selectedBillingAddress ? 'checked' : undefined;
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
      toastr.error( 'Sie dürfen nur 4 Rechnungsadressen anlegen.' );
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
  'click #book-course-select-address-button': function (event, template) {
    var selectedBillingAddress = template.find('input:radio[name=book-course-select-address-radio]:checked');
    
    if (! selectedBillingAddress) {
      toastr.error( "Keine Rechnungsadresse ausgewählt." );
      return false;
    } else 
      selectedBillingAddress = parseInt( selectedBillingAddress.id );

    var user = Meteor.user();
    if ( ! user )
      return false;
    var address = user.profile.billingAddresses[ selectedBillingAddress ];
    
    if ( ! address || ! address.street || ! address.streetNumber || ! address.plz || ! address.city ) {
      toastr.error( 'Die ausgewählte Adresse ist unvollständig.' );
      return false;
    }
    
    Meteor.call('updateSelectedBillingAddress', selectedBillingAddress, function (error, result) {
      if (error)
        toastr.error( error.reason );
      else {
        var args = {
          bookingId: Router.current().params._id,
          argName: 'billingAddress',
          argValue: ''
        };
        Meteor.call('updateBooking', args, function (error, result) {
          if (error)
            toastr.error( error.reason );
          else {
            Session.set('bookCourseTemplate', "bookCoursePaymentMethod");

            $('#bookCourseAddress').children('.progress-tracker').removeClass('active').addClass('inactive');
            $('#bookCoursePaymentMethod').children('.progress-tracker').removeClass('inactive').addClass('active');
          }
        });
      }
    });
  },
  // 'change input:radio[name=book-course-address-radio]': function (event) {
  //   Session.set("bookCourseAddress", event.currentTarget.id);
  // }
});