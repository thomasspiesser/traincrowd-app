Package.describe({
  name: 'tomsp:share',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use(["jquery", "templating", "less", "underscore"], 'client');
  api.use(["fortawesome:fontawesome@4.3.0"], 'client');

  api.addFiles('share.js');

  api.addFiles([
    'client/share.html',
    'client/share.js',
    'client/share.less',
    'client/services/facebook/facebook.html',
    'client/services/facebook/facebook.js',
    'client/services/twitter/twitter.html',
    'client/services/twitter/twitter.js',
    'client/services/linkedin/linkedin.html',
    'client/services/linkedin/linkedin.js',

    ], 'client');

  api.export('Share', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('tomsp:share');
  api.addFiles('share-tests.js');
});
