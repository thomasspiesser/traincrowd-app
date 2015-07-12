Template.share_twitter.onRendered( function () {
	// required
  var baseLink = "https://twitter.com/intent/tweet";
  var href = encodeURIComponent( location.origin + '/course/' + this.slug );
  var text = encodeURIComponent( "some text");
  var shareLink = baseLink + "?url=" + href + "&text=" + text;

  Template.instance().$(".tw-share").attr("href", shareLink);
});

Template.share_twitter.helpers(Share.helpers);