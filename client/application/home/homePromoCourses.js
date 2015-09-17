Template.homePromoCourses.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe("topCourses");
});

Template.homePromoCourses.helpers({
	topCourses: function () {
    // return Courses.find( { isPublic: true }, { limit: 6 } );
    return Courses.find( { '_id': { $in: [
			'RE3cdsSrgwnofgAuE', // billing - live-auftritt
			'zceXGneZ7vxiLRH5G', // changer - eu fundraising
			'riZpSyWvdMWMfKhyC', // ruehl - bilanzen lesen
			'sC3KSEWQqyTwxi8Rd', // witt - living working germany
			'v9ANydsyGqoijmr6v', // changer - social media marketing
			'rkJTSDjc2jaYuBp7R' // herzog - chef
		] } } );
  },
});