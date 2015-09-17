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
  'change #select-no-of-participants': function (event, template) {
    var seats = parseInt( event.currentTarget.value );
    var additionalParticipants = seats-1;
    var inputStr = '<tr class="additional-participants-row"><td> <div><input type="text" class="additional-emails form-control" placeholder="Email"> </div></td><td class="text-right">' + this.courseFeePP + ' Euro</td></tr>';
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
    var seats = template.find('#select-no-of-participants').value;
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