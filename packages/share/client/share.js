Template.share.helpers({
  siteTemplates: function () {
    var templates = [];
    var i, len, ref, site;

    ref = Share.settings.siteOrder;
    for ( i = 0, len = ref.length; i < len; i++ ) {
      site = ref[i];
      if ( Share.settings.sites[site].use ) {
        templates.push( 'share_' + site );
      }
    }
    return templates;
  }
 });

Template.share.events( {
  'click [rel="popup"]': function ( event ) {
    event.preventDefault();

    var url = event.currentTarget.href;
    var windowName = '_blank';
    var windowSizeX = '600';
    var windowSizeY = '460';
    var windowSize = 'width=' + windowSizeX + ',height=' + windowSizeY;

    window.open( url, windowName, windowSize );
  }
});