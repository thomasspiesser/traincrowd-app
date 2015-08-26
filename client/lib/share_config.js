Share.configure({
  sites: {                // nested object for extra configurations
      'facebook': {
        'appId': 1419012125078098,   // use sharer.php when it's null, otherwise use share dialog
        'use':true
      },
      'twitter': {
        'use':true
      },
      'linkedin': {
        'use':true
      }
      // 'googleplus': {},
      // 'pinterest': {}
  },
  // siteOrder: [ 'twitter', 'facebook', 'instagram', 'googleplus', 'pinterest'], // careful, must name all of them in here, coz overrides
  classes: "btn", // string (default: 'large btn')
                        // The classes that will be placed on the sharing buttons, bootstrap by default.
  iconOnly: true,      // boolean (default: false)
                        // Don't put text on the sharing buttons
  applyColors: true,     // boolean (default: true)
                        // apply classes to inherit each social networks background color
  faSize: '',            // font awesome size
  faClass: ''       // font awesome classes like square
});
