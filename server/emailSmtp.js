// process.env.MAIL_URL="smtp://thomas.spiesser%40gmail.com:7%mau6d$@smtp.gmail.com:465/";
// process.env.MAIL_URL="smtp://thomas%40traincrowd.de:7%mau6d$@smtp.strato.de:465/";
// process.env.MAIL_URL='smtp://thomas%40traincrowd.de:' + encodeURIComponent("7%mau6d$") + '@smtp.strato.de:465/';

Meteor.startup(function () {

  smtp = {
    username: 'info@traincrowd.de',   // eg: server@gentlenode.com
    password: 'Fk2Dk*5e$4M9',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.strato.de',  // eg: mail.gandi.net
    port: 587
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

});