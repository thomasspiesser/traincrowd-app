_generateBill = function( options ) {
  // zusammenbasteln

  var fields = { eventId: 1, course: 1, courseTitle: 1, courseFeePP: 1, coupon: 1, seats: 1, billingAddress: 1, eventDate: 1, customerName: 1, trainerName: 1, paymentMethod: 1, transactionDate: 1 };
  var booking = Bookings.findOne( { _id: options.bookingId }, { fields: fields } );
  var pass = checkExistanceSilent( booking, "Buchung", options.bookingId, _.omit( fields, 'coupon' ) );

  if ( ! pass )
    return;

  fields = { taxRate: 1};
  var course = Courses.findOne( { _id: booking.course }, { fields: fields } ); 
  pass = checkExistanceSilent( course, "course", booking.course, fields );

  if ( ! pass )
    return;

  var dataContext = _.extend(booking, course);

  dataContext.billingIndex = Utils.findOne().billingCount;
  dataContext.eventDate = booking.getPrettyDates();
  dataContext.transactionDate = moment( booking.transactionDate ).format('DD.MM.YYYY');
  dataContext.isInvoice = booking.paymentMethod === 'Rechnung';
  console.log(dataContext);

  var html = Spacebars.toHTML(dataContext, Assets.getText('bill.html'));
  // console.log(html);

  // var fs      = Npm.require('fs');
  var filePath = "/tmp/bill.pdf";
  // Setup Webshot options
  var options = {
    "paperSize": {
      "format": "Letter",
      "margin": {
        top: "2cm",
        left: "1cm",
        right: "1cm",
        bottom: "1cm",
      },
    },
    siteType: 'html',
  };
  var attachment = {
    fileName: 'Rechnung traincrowd' + booking.customerName + '.pdf',
    filePath: filePath,
  };

  webshot(html, filePath, options, function(err) {
    console.log('inner');
    if (err) {
      return console.log(err);
    }
    else {
      console.log('attachment');
      console.log(attachment);
      return attachment;
    }
  });

};
