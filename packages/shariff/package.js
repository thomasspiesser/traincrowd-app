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
  api.use(["jquery", "templating", "less"], 'client');
  api.use(["fortawesome:fontawesome@4.3.0"], 'client');

  api.addFiles('shariff.min.js', 'client');
  api.addFiles([
    'style/shariff.less',
    'style/shariff-services.less',
    'style/shariff-layout.less',
    'style/services/facebook.less',
    'style/services/googleplus.less',
    'style/services/info.less',
    'style/services/linkedin.less',
    'style/services/mail.less',
    'style/services/pinterest.less',
    'style/services/twitter.less',
    'style/services/whatsapp.less',
    'style/services/xing.less',
    ], 'client');
  api.addFiles(['shareprivate.html', 'shareprivate.js'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('tomsp:shariff');
  api.addFiles('shariff-tests.js');
});