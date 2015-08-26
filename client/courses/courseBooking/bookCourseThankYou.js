Template.bookCourseThankYou.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe( 'singleCourseById', this.data.course );
});

Template.bookCourseThankYou.helpers({
  invoice: function () {
    return this.paymentMethod === 'Rechnung';
  },
	shareData: function () {
		var course = Courses.findOne( { _id : this.course }, { fields: { title: 1, description: 1, slug: 1 } } );
    var data = {
      title: encodeURIComponent( course.title ),
      description: encodeURIComponent( course.description ),
      url: encodeURI( Meteor.absoluteUrl() + 'course/' + course.slug )
    };
    return data;
  }
});

Template.bookCourseThankYou.events({
  'click .btn-social': function ( event ) {
    event.preventDefault();
    var url = event.currentTarget.href;
    var windowName = '_blank';
    var windowSizeX = '600';
    var windowSizeY = '460';
    var windowSize = 'width=' + windowSizeX + ',height=' + windowSizeY;

    var sharewindow = window.open( url, windowName, windowSize );
    var timer = Meteor.setInterval( checkClosed, 500 );
    var bookingId = this._id;
    console.log(bookingId);

    function checkClosed() {
      if ( sharewindow.closed ) {
        Meteor.clearInterval( timer );
        Meteor.call('setHasShared', bookingId, function ( error, result ) {
          if ( error )
            toastr.error( error.reason );
        });
      }
    }
  }
});