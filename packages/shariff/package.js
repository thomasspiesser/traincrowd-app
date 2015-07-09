Package.describe({
  name: 'tomsp:shariff',
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
  api.versionsFrom('1.1.0.2');
  api.use(["jquery"]);
  api.addFiles('shariff.min.js', 'client');
  // api.export('Shariff');
  api.addFiles('shariff.min.css', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('tomsp:shariff');
  api.addFiles('shariff-tests.js');
});