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
    let booking = Bookings.findOne( { _id: bookingId }, { fields: fields } );
    let pass = checkExistanceSilent( booking, 'Buchung', bookingId,
      _.omit( fields, 'coupon' ) );

    if ( ! pass ) {
      return;
    }

    fields = { taxRate: 1 };
    let course = Courses.findOne( { _id: booking.course }, { fields: fields } );
    pass = checkExistanceSilent( course, 'course', booking.course, fields );

    if ( ! pass ) {
      return;
    }

    let dataContext = _.extend( booking, course );

    let utils = Utils.findOne();
    dataContext.billingIndex = utils.billingCount;
    dataContext.eventDate = booking.getPrettyDates();
    dataContext.transactionDate = moment( booking.transactionDate )
    .format('DD.MM.YYYY');
    dataContext.isInvoice = booking.paymentMethod === 'Rechnung';
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

    webshot(html, filePath, options, function( error ) {
      if (error) {
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
      } catch ( err ) {
        console.log( emailOptions.to );
        console.log( emailOptions.subject );
        console.log( err );
      }
    });
  });
};
