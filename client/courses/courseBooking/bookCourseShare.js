Template.bookCourseShare.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe( 'singleCourseById', this.data.course );
  this.showShareBox = new ReactiveVar( true );
  if ( this.data.hasShared )
    this.showShareBox.set( false );
});

Template.bookCourseShare.helpers({
  invoice: function () {
    return this.paymentMethod === 'Rechnung';
  },
	shareData: function () {
		var course = Courses.findOne( { _id : this.course }, { fields: { title: 1, description: 1, slug: 1 } } );
    var data = {
      title: encodeURIComponent( course.title ),
      description: encodeURIComponent( course.description ),
      url: encodeURI( Meteor.absoluteUrl() + 'course/' + course.slug ),
      redirectURL: encodeURI( Meteor.absoluteUrl() + 'close-window' )
    };
    return data;
  },
  showShareBox: function() {
    return Template.instance().showShareBox.get();
  }
});

Template.bookCourseShare.events({
  'click .btn-social': function ( event, template ) {
    event.preventDefault();
    var url = event.currentTarget.href;
    var windowName = '_blank';
    var windowSizeX = '600';
    var windowSizeY = '460';
    var windowSize = 'width=' + windowSizeX + ',height=' + windowSizeY;

    var sharewindow = window.open( url, windowName, windowSize );
    var bookingId = this._id;
    var hasShared = this.hasShared;
    var timer = Meteor.setInterval( function () {
      if ( sharewindow.closed ) {
        Meteor.clearInterval( timer );
        if ( ! hasShared ) {
          Meteor.call('setHasShared', bookingId, function ( error, result ) {
            if ( error )
              toastr.error( error.reason );
            else
              template.showShareBox.set( false );
          });
        }
        else
          template.showShareBox.set( false );
      }
    }, 500 );
  },
  'click #shareAgain': function ( event, template) {
    template.showShareBox.set( true );
  }
});