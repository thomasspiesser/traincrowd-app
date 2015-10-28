_deferGenerateBillAndSendEmail = function( emailOptions, bookingId ) {
  Meteor.defer( function() {
    let fields = {
      eventId: 1,
      course: 1,
      courseTitle: 1,
      courseFeePP: 1,
      coupon: 1,
      seats: 1,
      billingAddress: 1,
      eventDate: 1,
      customerName: 1,
      trainerName: 1,
      paymentMethod: 1,
      transactionDate: 1,
    };
    const booking = Bookings.findOne( { _id: bookingId }, { fields: fields } );
    let pass = checkExistanceSilent( booking, 'Buchung', bookingId,
      _.omit( fields, 'coupon' ) );

    if ( ! pass ) {
      return;
    }

    fields = { taxRate: 1 };
    const course = Courses.findOne( { _id: booking.course }, {
      fields: fields,
    });
    pass = checkExistanceSilent( course, 'course', booking.course, fields );

    if ( ! pass ) {
      return;
    }

    function _format( arg ) { return arg.toFixed(2).replace('.', ','); }

    let dataContext = _.extend( booking, course );
    const utils = Utils.findOne();
    dataContext.billingIndex = utils.billingCount;
    dataContext.eventDate = booking.getPrettyDates();
    dataContext.transactionDate = moment( booking.transactionDate )
    .format('DD.MM.YYYY');
    dataContext.isInvoice = booking.paymentMethod === 'Rechnung';
    dataContext.courseFeePPWoTax =
      _format( booking.courseFeePP / ( 100 + course.taxRate ) * 100 );
    dataContext.subtotal = booking.seats * booking.courseFeePP;

    if ( booking.coupon ) {
      dataContext.couponAmountWoTax =
        _format( booking.coupon.amount / ( 100 + course.taxRate ) * 100 );
      dataContext.coupontotal = booking.seats * booking.coupon.amount;
      dataContext.total = dataContext.subtotal - dataContext.coupontotal;
    } else {
      dataContext.total = dataContext.subtotal;
    }
    dataContext.tax = _format( dataContext.total - dataContext.total /
      ( 100 + course.taxRate ) * 100 );
    dataContext.nettototal =
      _format( dataContext.total / ( 100 + course.taxRate ) * 100 );

    console.log(dataContext);

    let html = Spacebars.toHTML(dataContext, Assets.getText('bill.html'));
    let fileId = Random.id();
    let filePath = `/tmp/bill${fileId}.pdf`;

    // Setup Webshot options
    let options = {
      paperSize: {
        format: 'Letter',
        margin: {
          top: '2cm',
          left: '1cm',
          right: '1cm',
          bottom: '1cm',
        },
      },
      siteType: 'html',
    };
    let attachment = {
      fileName: `Rechnung traincrowd ${booking.customerName}.pdf`,
      filePath: filePath,
    };

    webshot(html, filePath, options, error => {
      if ( error ) {
        console.log( `ERROR creating bill for ${booking.customerName}` );
        console.log( error );
        return false;
      }
      emailOptions.attachments = [ attachment ];
      try {
        _sendEmail( emailOptions );
        emailOptions.to = 'kopie@traincrowd.de';
        _sendEmail( emailOptions );
        // delete the file with fs.unlink(filePath) - but they get deleted
        // anyways on redeploy so...
        Utils.update( { _id: utils._id }, { $inc: { billingCount: 1 } } );
      } catch ( error ) {
        console.log( emailOptions.to );
        console.log( emailOptions.subject );
        console.log( error );
      }
    });
  });
};
