Template.rateCourse.onRendered( function() {
  $('.rateit').rateit();
});

Template.rateCourse.helpers({
  isValidToken: function () {
    console.log(this);
    return !!this.user && !!this.elapsed;
  },
});

Template.rateCourse.events({
  'click #submit-rating': function ( event, template ) {
    var ratedValue0 = parseFloat(template.find('#backing0').value);
    var ratedValue1 = parseFloat(template.find('#backing1').value);
    var ratedValue2 = parseFloat(template.find('#backing2').value);
    var ratedValue3 = parseFloat(template.find('#backing3').value);
    var ratedValue4 = parseFloat(template.find('#backing4').value);
    var ratedValue5 = parseFloat(template.find('#backing5').value);
    ratedValues = [ratedValue0, ratedValue1, ratedValue2, ratedValue3, ratedValue4, ratedValue5];

    var recommendation = template.find('#rate-course-recommendation').value;
    var comment = template.find('#rate-course-comment').value;

    var options = { 
      elapsedId: Router.current().params.id,
      values: ratedValues,
      comment: comment,
      recommendation: recommendation,
      token: Router.current().params._token
    };

    Meteor.call('rateCourse', options, function ( error, result ) {
      if ( error )
        toastr.error( error.reason || error.message );
      else {
        toastr.success( 'Gespeichert.' );
      }
    });    
  }
});