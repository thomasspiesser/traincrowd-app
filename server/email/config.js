const username = Meteor.settings.email.username;
const password = Meteor.settings.email.password;

Meteor.startup(function() {
  smtp = {
    username: username,   // eg: server@gentlenode.com
    password: password,   // eg: eQeQvszKX3M2A7
    server: 'smtp.strato.de',  // eg: mail.gandi.net
    port: 587,
  };

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});
