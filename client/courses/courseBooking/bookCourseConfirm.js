Template.bookCourseConfirm.onCreated(function () {
  this.totalFee = new ReactiveVar();
  this.showSpinner = new ReactiveVar( false );
  if (this.data.coupon)
    this.totalFee.set(this.data.courseFeePP - this.data.coupon.amount);
  else
    this.totalFee.set(this.data.courseFeePP);
});

Template.bookCourseConfirm.helpers({
  number: function () {
    return _.range(1,10);
  },
  totalFee: function () {
    return Template.instance().totalFee.get();
  },
  reducedFeePP: function () {
    return this.courseFeePP - this.coupon.amount;
  },
  showSpinner: function () {
    return Template.instance().showSpinner.get();
  }
});

Template.bookCourseConfirm.events({
  'click #redeem-coupon, submit #coupon-form': function (event, template) {
    template.showSpinner.set( true );
    event.preventDefault();
    var code = template.find('#enter-coupon-code').value;
    if ( ! code.length ) {
      toastr.error( "Sie müssen einen Code eingeben." );
      template.showSpinner.set( false );
      return false;
    }
    var options = {
      bookingId: this._id,
      code: code
    };
    var self = this;
    Meteor.call('redeemCoupon', options, function (error, result) {
      if ( error ) {
        toastr.error( error.reason || error.message );
        template.showSpinner.set( false );
      }
      else {
        toastr.success( 'Gutschein eingelöst.' );
        template.totalFee.set( self.courseFeePP - self.coupon.amount );
        // also remove additional participants so that they have to be entered again
        $('.additional-participants-row').remove();
        // and reset selector to 1 participant
        $('#select-no-of-participants').val('1');
        // and empty coupon field
        template.showSpinner.set( false );
      }
    });
  },
  'change #select-no-of-participants': function (event, template) {
    var seats = parseInt( event.currentTarget.value );
    if ( seats > 1 )
      $('#new-participants-info').fadeTo( 'slow', 1 );
    else
      $('#new-participants-info').fadeTo( 'slow', 0 );

    var additionalParticipants = seats-1;
    var inputStr;
    if ( this.coupon ) {
      inputStr =  '<tr class="additional-participants-row">'+
                    '<td>'+
                      '<div><input type="text" class="additional-emails form-control" placeholder="Email"> </div>'+
                      '<div>Gutschein: ' + this.coupon.code + '</div>'+
                    '</td>'+
                    '<td class="text-right">'+ 
                      this.courseFeePP + ',- Euro'+
                      '<div>-' + this.coupon.amount + ',- Euro</div>'+
                      '<div style="border-top:1px solid grey;">' + (this.courseFeePP - this.coupon.amount) + ',- Euro</div>'+
                    '</td>'+
                  '</tr>';
      template.totalFee.set( ( this.courseFeePP - this.coupon.amount ) * seats );
    }
    else {
      inputStr = '<tr class="additional-participants-row"><td> <div><input type="text" class="additional-emails form-control" placeholder="Email"> </div></td><td class="text-right">' + this.courseFeePP + ',- Euro</td></tr>';
      template.totalFee.set( this.courseFeePP * seats );
    }
    $('.additional-participants-row').remove();
    $('#participants-table').find('tbody:last').append( inputStr.repeat( additionalParticipants ) );
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