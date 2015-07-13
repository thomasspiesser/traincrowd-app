Template.share_linkedin.onRendered( function () {
  var title = ""; 
  var shareLink;
  var data =  Template.currentData();
  var href = encodeURIComponent( data.url );
  var baseLink = "https://www.linkedin.com/cws/share?url=";


  shareLink = baseLink + href;

  Template.instance().$(".in-share").attr("href", shareLink);
});

Template.share_linkedin.helpers(Share.helpers);