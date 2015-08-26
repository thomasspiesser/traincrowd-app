Template.share_twitter.onRendered( function () {
	var title = ""; 
	var shareLink;
  var data =  Template.currentData();
  var href = encodeURIComponent( data.url );
  var baseLink = "https://twitter.com/intent/tweet?url=";

  if ( data.title ) {
    title = encodeURIComponent( data.title );
  }

  shareLink = baseLink + href + "&text=" + title;

  Template.instance().$(".tw-share").attr("href", shareLink);
});

Template.share_twitter.helpers(Share.helpers);