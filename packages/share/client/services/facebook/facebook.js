Template.share_facebook.onRendered( function () {
	// required
  var baseLink = "https://www.facebook.com/dialog/share?";
  var app_id = "1419012125078098"; // TC app Id
  var display = "popup";
  var href = encodeURIComponent( location.origin + '/course/' + this.slug );
  var redirect_uri = encodeURIComponent( location.origin + '/close-window' );
  var shareLink = baseLink + "app_id=" + app_id + "&display=" + display + "&href=" + href + "&redirect_uri=" + redirect_uri;

  Template.instance().$(".fb-share").attr("href", shareLink);
});

Template.share_facebook.helpers(Share.helpers);