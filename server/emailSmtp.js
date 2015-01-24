Meteor.startup(function () {

  smtp = {
    username: 'info@traincrowd.de',   // eg: server@gentlenode.com
    password: 'Fk2Dk*5e$4M9',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.strato.de',  // eg: mail.gandi.net
    port: 587
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

});