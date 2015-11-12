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
    let booking = Bookings.findOne( { _id: bookingId }, { fields: fields } );
    let pass = checkExistanceSilent( booking, 'Buchung', bookingId,
      _.omit( fields, 'coupon' ) );
    if ( ! pass ) {
      return;
    }

    fields = { taxRate: 1 };
    let course = Courses.findOne( { _id: booking.course }, {
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
    dC.transactionDate = moment( booking.transactionDate ).format('DD.MM.YYYY');
    dC.isInvoice = booking.paymentMethod === 'Rechnung';
    dC.courseFeePPWoTax = _format( booking.courseFeePP /
      ( 100 + course.taxRate ) * 100 );
    dC.subtotal = booking.seats * booking.courseFeePP;
    if ( booking.coupon ) {
      dC.couponAmountWoTax = _format( booking.coupon.amount /
        ( 100 + course.taxRate ) * 100 );
      dC.coupontotal = booking.seats * booking.coupon.amount;
      dC.total = dC.subtotal - dC.coupontotal;
    } else {
      dC.total = dC.subtotal;
    }
    dC.tax = _format( dC.total - dC.total / ( 100 + course.taxRate ) * 100 );
    dC.nettototal = _format( dC.total / ( 100 + course.taxRate ) * 100 );
    // start from zero every year
    let start = moment().startOf('year')._d;
    let end = moment().endOf('year')._d;
    dC.billNumber = Bills.find( { createdAt: { $gte: start, $lt: end } } )
      .count() + 1;
    // generate html with data
    let html = Spacebars.toHTML( dC, Assets.getText('bill.html') );

    // insert immediately, block that billNumber - if this failes throw
    Bills.insert({
      bookingId: bookingId,
      customer: booking.customer,
      customerName: booking.customerName,
      number: dC.billNumber,
    });

    // generate file name and path
    let filePath;
    let filename = `bill${Random.id()}.html`;
    if ( process.env.NODE_ENV === 'development' ) {
      filePath = '/tmp/' + filename;
    } else {
      let path = Npm.require('path');
      filePath = path.join( process.env.TEMP_DIR, filename );
    }

    // write html to file
    let fs = Npm.require('fs');
    let writeFileSync = Meteor.wrapAsync( fs.writeFile );
    try {
      writeFileSync( filePath, html );
    } catch ( error ) {
      console.log( 'Error writing html to file:');
      console.log( error );
    }

    // call phantom to render pdf from html
    let childProcess = Npm.require('child_process');
    let cmd = 'phantomjs assets/app/phantomDriver.js ' + filePath;
    let execSync = Meteor.wrapAsync( childProcess.exec );
    try {
      execSync( cmd );
    } catch ( error ) {
      console.log( 'Error phantomjs:');
      console.log( error );
    }

    // attach pdf to email
    emailOptions.attachments = [{
      fileName: `Rechnung traincrowd ${booking.customerName}.pdf`,
      filePath: filePath.replace('.html', '.pdf'),
    }];

    // and send it
    try {
      _sendEmail( emailOptions );
      emailOptions.to = 'kopie@traincrowd.de';
      _sendEmail( emailOptions );
      // del tmp files
      fs.unlink( filePath );
      fs.unlink( filePath.replace('.html', '.pdf') );
    } catch ( error ) {
      console.log( emailOptions );
      console.log( error );
    }
  });
};
