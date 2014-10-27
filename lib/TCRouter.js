Router.route('/', function () {
  // render the Home template with a custom data context
  // this.render('Home', {data: {title: 'My Title'}});
  this.render('home');
});

// when you navigate to "/one" automatically render the template named "One".
Router.route('/createCourse');
Router.route('/about');

Router.configure({
  layoutTemplate: 'TCLayout'
});