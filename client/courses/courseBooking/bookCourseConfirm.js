Template.bookCourseConfirm.onCreated(function () {
  this.totalFee = new ReactiveVar( this.data.courseFeePP );
});

Template.bookCourseConfirm.helpers({
  number: function () {
    return _.range(1,10);
  },
  totalFee: function () {
    return Template.instance().totalFee.get();
  }
});

Template.bookCourseConfirm.events({
  'click #redeem-coupon, submit #coupon-form': function (event, template) {
    event.preventDefault();
    var code = template.find('#enter-coupon-code').value;
    if ( ! code.length ) {
      toastr.error( "Sie müssen einen Code eingeben." );
      return false;
    }
    var options = {
      bookingId: this._id,
      code: code
    };
    Meteor.call('redeemCoupon', options, function (error, result) {
      if ( error )
        toastr.error( error.reason || error.message );
      else
        toastr.success( 'Gutschein eingelöst.' );
    });
    $('#enter-coupon-code').val('');
  },
  'change #select-no-of-participants': function (event, template) {
    var seats = parseInt( event.currentTarget.value );
    if ( seats > 1 ) {
      $('#new-participants-info').fadeTo('slow',1, function(){});
    }
    else {
      $('#new-participants-info').fadeTo('slow',0, function(){});
    }

    var additionalParticipants = seats-1;
    var inputStr = '<tr class="additional-participants-row"><td> <div><input type="text" class="additional-emails form-control" placeholder="Email"> </div></td><td class="text-right">' + this.courseFeePP + ',- Euro</td></tr>';
    $('.additional-participants-row').remove();
    $('#participants-table').find('tbody:last').append( inputStr.repeat( additionalParticipants ) );
    template.totalFee.set( this.courseFeePP * seats );
  },
  'click #change-contact': function ( event, template ) {
    Modal.show('editContactModal');
  },
  'click #agb-link': function () {
    Modal.show('agbModal');
  },
  'click #book-course-pay': function ( event, template ) {
    $('.additional-emails').parent().removeClass('has-error');
    if ( ! Meteor.userId() ){
      toastr.error( "Sie müssen eingeloggt sein." );
      return false;
    }
    var agb = template.find('#accept-agb').checked;
    if ( ! agb ) {
      toastr.error( "Sie müssen die ABGs akzeptieren." );
      return false;
    }

    // get total number of seats
    var seats = parseInt( template.find('#select-no-of-participants').value );
    // get the additional emails - array
    var additionalParticipants = [];
    // need fucking flag coz 'return false' in each loop just breaks the loop, not the event
    var flag;
    $('.additional-emails').each( function() {
      var email = this.value;
      // validate
      if ( ! EMAIL_REGEX.test( email ) ) {
        $(this).parent().addClass('has-error');
        toastr.error( "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben." );
        flag = true;
      }
      else
        additionalParticipants.push( email );
    });
    if (flag)
      return false;

    if ( template.find('#subscribe-newsletter').checked ) {
      Meteor.call( 'updateSingleUserField', { argName: 'newsletter', argValue: true }, function ( error, result ) {
        if ( error ) {
          toastr.error( 'Fehler Newsletter: ' + error.reason );
          return false;
        }
      });
    }
    var bookingId = this._id;
    switch ( this.paymentMethod ) {
      case 'Rechnung':
        Meteor.call( 'createInvoice', { bookingId: bookingId, seats: seats, additionalParticipants: additionalParticipants }, function ( error, result ) {
          if ( error )
            toastr.error( error.reason );
          else {
            toastr.success('Buchung erfolgreich.');
            Router.go( "book.course", { _id: bookingId, state: "bookCourseShare" } );
          }
        });
        break;
      case 'Kreditkarte':
        Modal.show( 'payModal', { bookingId: bookingId, seats: seats, additionalParticipants: additionalParticipants, feePP: template.totalFee.get() } );
        break;
    }
  }
});

// polyfill for string.repeat (not yet supported in Safarie, IE, Opera)

if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (;;) {
      if ((count & 1) == 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count == 0) {
        break;
      }
      str += str;
    }
    return rpt;
  };
}