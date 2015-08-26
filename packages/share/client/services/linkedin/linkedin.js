Template.share_linkedin.onRendered( function () {
  var title = ""; 
  var summary = ""; 
  var source = "&source=traincrowd"; 
  var shareLink;
  var data =  Template.currentData();
  var href = encodeURIComponent( data.url );
  // var baseLink = "https://www.linkedin.com/cws/share?url=";
  var baseLink = "https://www.linkedin.com/shareArticle?mini=true&url=";

  if ( data.title ) {
    title = '&title=' + encodeURIComponent( data.title );
  }

  if ( data.description ) {
    summary = '&summary=' + encodeURIComponent( data.description );
  }

  shareLink = baseLink + href + title + summary + source;

  Template.instance().$(".in-share").attr("href", shareLink);
});

Template.share_linkedin.helpers(Share.helpers);