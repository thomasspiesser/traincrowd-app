Template.homePromoCourses.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe("topCourses");
});

Template.homePromoCourses.helpers({
	topCourses: function () {
    // return Courses.find( { isPublic: true }, { limit: 6 } );
    return Courses.find( { 'title': { $in: ['Ihr wirksamer Live-Auftritt', 'Tipps und Tricks für EU Fundraising', 'Bilanzen lesen, BWAs verstehen - Rechnungswesen für Entscheider.', 'Living & Working in Germany – German cultural standards in business', 'Social Media Marketing und Strategie Entwicklung', 'Navigation ohne Karte: Strategie Arbeit in der Organisationsentwicklung'] } } );
  },
});