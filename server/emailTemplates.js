// (server-side)
Meteor.startup(function() {
  // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
  Accounts.emailTemplates.from = 'Traincrowd <info@traincrowd.de>';

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = 'Traincrowd';

  // A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Bitte bestätigen Sie noch Ihre Email Adresse';
  };

  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Bitte klicken Sie den folgenden link an, um Ihre Email Adresse zu bestätigen: ' + url;
  };

  Accounts.emailTemplates.resetPassword.subject = function(user) {
    return 'Passwort vergessen?';
  };
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    return 'Guten Tag ' + displayName(user) + ',\n\n' + 'Um Ihr Passwort zurückzusetzen, klicken Sie einfach auf den folgenden Link:\n\n' + url + '\n\n' + 'Vielen Dank.';
  };
  // Accounts.emailTemplates.resetPassword.html = function(user, url) {
  //   return 'bitte den folgenden link anklicken, um Ihre Email Adresse zu bestätigen: ' + url;
  // };
});