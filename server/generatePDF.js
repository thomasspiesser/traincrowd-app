_worker = function() {
  var dataContext = {
    name: 'Thomas',
    imgPath: path.join(__meteor_bootstrap__.serverDir, "../web.browser/app")
  };
  // console.log(dataContext);
  var html = Spacebars.toHTML(dataContext, Assets.getText('bill.html'));
  // console.log(html);

  // var fs      = Npm.require('fs');
  var fileName = "/tmp/bill.pdf";
  // Setup Webshot options
  var options = {
    "paperSize": {
      "format": "Letter",
      // "orientation": "portrait",
      "margin": {
        top: "2cm",
        left: "1cm",
        right: "1cm",
        bottom: "1cm",
      },
    },
    siteType: 'html',
    // phantomPath: '/usr/local/bin/phantomjs',
    // errorIfStatusIsNot200: true
  };
  webshot(html, fileName, options, function(err) {
    console.log('inner');
    if (err) {
      return console.log(err);
    }
  });

};

// _generatePDF = function(html, options) {
//   wkhtmltopdf(html, function(code, signal) {
//     console.log('code');
//     console.log(code);
//     console.log('signal');
//     console.log(signal);
//     console.log('worked!', fs.readFileSync('out.pdf').toString());
//   }).pipe(fs.createWriteStream('out.pdf'));
// };