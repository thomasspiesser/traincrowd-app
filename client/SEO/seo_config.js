Meteor.startup(function() {
  return SEO.config({
    title: 'traincrowd - improve yourself. learn together',
    meta: {
      'description': "traincrowd ist die innovative crowdsourcing-Plattform für Trainings, Seminare und Weiterbildungen. Auf traincrowd finden Sie Berlins Top-Auswahl, deshalb ist bei uns für Sie garantiert immer der richtige Kurs dabei."
    },
    og: {
      'site_name': 'traincrowd',
      'type': 'website',
      'image': '/images/Landing-top.jpeg' 
   },
   ignore: {
    meta: ['google-site-verification', 'fb:app_id', 'fragment', 'viewport'],
    link: ['stylesheet', 'icon', 'apple-touch-icon']
   }
  });
});