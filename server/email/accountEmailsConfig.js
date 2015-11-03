Meteor.startup( function() {
  Accounts.emailTemplates.from = 'traincrowd <info@traincrowd.de>';

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = 'traincrowd';

  Accounts.emailTemplates.resetPassword.subject = function( user ) {
    return 'Passwort vergessen?';
  };

  Accounts.emailTemplates.resetPassword.text = function( user, url ) {
    return 'Guten Tag ' + user.getName() + ',\n\n' + 'Um Ihr Passwort zurückzusetzen, klicken Sie einfach auf den folgenden Link:\n\n' + url + '\n\n' + 'Vielen Dank.\n';
  };

  Accounts.emailTemplates.enrollAccount.subject = function( user ) {
    return "Es wurde für Sie auf " + Accounts.emailTemplates.siteName + " ein Account angelegt";
  };

  Accounts.emailTemplates.enrollAccount.text = function( user, url ) {
    url = url.replace('#/', '');
    return 'Hallo.\n\n' + 'Um Ihren neuen Account zu Nutzen, klicken Sie einfach auf den folgenden Link:\n\n' + url + '\n\n' + 'Viel Spass.\n';
  };

});
