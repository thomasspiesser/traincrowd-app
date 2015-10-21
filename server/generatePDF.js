_worker = function() {
  var dataContext = {
    name: 'Thomas',
  };
  console.log(dataContext);
  var html = Spacebars.toHTML(dataContext, Assets.getText('bill.html'));
  console.log(html);
  // var webshot = Meteor.npmRequire('webshot');
  // console.log(webshot);
  // var fs      = Npm.require('fs');
  var fileName = "/tmp/bill.pdf";
  console.log(fileName);
  // Setup Webshot options
  var options = {
    "paperSize": {
      "format": "Letter",
      "orientation": "portrait",
      "margin": "1cm"
    },
    siteType: 'html',
    // phantomPath: '/usr/local/bin/phantomjs',
    // errorIfStatusIsNot200: true
  };
  console.log(options);
  webshot(html, fileName, options, function(err) {
    console.log('inner');
    if (err) {
      return console.log(err);
    }
  });
  console.log('after');

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