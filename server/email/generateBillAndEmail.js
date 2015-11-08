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
      customer: 1,
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

    // dataContext is dC
    let dC = _.extend( booking, course );
    dC.eventDate = booking.getPrettyDates();
    dC.transactionDate = moment( booking.transactionDate )
      .format('DD.MM.YYYY');
    dC.isInvoice = booking.paymentMethod === 'Rechnung';
    dC.courseFeePPWoTax =
      _format( booking.courseFeePP / ( 100 + course.taxRate ) * 100 );
    dC.subtotal = booking.seats * booking.courseFeePP;

    if ( booking.coupon ) {
      dC.couponAmountWoTax =
        _format( booking.coupon.amount / ( 100 + course.taxRate ) * 100 );
      dC.coupontotal = booking.seats * booking.coupon.amount;
      dC.total = dC.subtotal - dC.coupontotal;
    } else {
      dC.total = dC.subtotal;
    }
    dC.tax = _format( dC.total - dC.total /
      ( 100 + course.taxRate ) * 100 );
    dC.nettototal =
      _format( dC.total / ( 100 + course.taxRate ) * 100 );
    let start = moment().startOf('year')._d;
    let end = moment().endOf('year')._d;
    dC.billNumber = Bills.find( { createdAt: { $gte: start, $lt: end } } )
      .count();
    // insert immediately, block that billNumber - if this failes throw
    // Bills.insert({
    //   bookingId: bookingId,
    //   customer: booking.customer,
    //   customerName: booking.customerName,
    //   number: dC.billNumber,
    // });

    let html = Spacebars.toHTML( dC, Assets.getText('bill.html') );
    let filePath = `/tmp/bill${Random.id()}.html`;
    let fs = Npm.require('fs');
    let writeFileSync = Meteor.wrapAsync( fs.writeFile );
    try {
      writeFileSync( filePath, html );
    } catch ( exception ) {
      console.log( exception );
    }
    let childProcess = Npm.require('child_process');
    let cmd = 'phantomjs assets/app/phantomDriver.js ' + filePath;
    let execSync = Meteor.wrapAsync( childProcess.exec );
    try {
      execSync( cmd );
    } catch ( exception ) {
      console.log( exception );
    }
    // childProcess.exec( cmd,
    //   function(error, stdout, stderr) {
    //     console.log('stdout: ' + stdout);
    //     console.log('stderr: ' + stderr);
    //     if ( error ) {
    //       console.log('exec error: ' + error);
    //     }
    //   }
    // );

    emailOptions.attachments = [{
      fileName: `Rechnung traincrowd ${booking.customerName}.pdf`,
      filePath: filePath.replace('.html', '.pdf'),
    }];
    try {
      _sendEmail( emailOptions );
      // emailOptions.to = 'kopie@traincrowd.de';
      // _sendEmail( emailOptions );
      fs.unlink( filePath );
      fs.unlink( filePath.replace('.html', '.pdf') );
    } catch ( error ) {
      console.log( emailOptions.to );
      console.log( emailOptions.subject );
      console.log( error );
    }
  });
};
