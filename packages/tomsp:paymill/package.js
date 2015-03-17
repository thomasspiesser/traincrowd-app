Package.describe({
  name: 'tomsp:paymill',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Paymill Node package (by Thomas Schaaf) and Paymill`s Bridge.js repackaged for meteor.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.export('METEORPAYMILL');
  api.addFiles('paymill-node.js', 'server');
  api.addFiles('paymill-bridge.js', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('tomsp:paymill');
  api.addFiles('paymill-tests.js');
});

Npm.depends({ 
  'paymill-node': '0.1.2' 
});