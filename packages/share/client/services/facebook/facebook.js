Template.share_facebook.onRendered( function () {
  var baseLink, shareLink;

  var data =  Template.currentData();
  
  var href = encodeURIComponent( data.url );

  if ( Share.settings.sites.facebook.appId ) {
    var app_id = Share.settings.sites.facebook.appId; 
    var display = "popup";
    var redirect_uri = encodeURIComponent( location.origin + '/close-window' );
    
    if ( data.method === 'feed' ) {
      baseLink = "https://www.facebook.com/dialog/feed?";
      var picture = encodeURIComponent( data.picture );
      var caption = href;
      var description = encodeURIComponent( data.title );
      shareLink = baseLink + "app_id=" + app_id + "&display=" + display + "&redirect_uri=" + redirect_uri + "&picture=" + picture + "&caption=" + caption + "&link=" + href + "&description=" + description;
      console.log(shareLink);
    } 
    else {
      baseLink = "https://www.facebook.com/dialog/share?";
      shareLink = baseLink + "app_id=" + app_id + "&display=" + display + "&href=" + href + "&redirect_uri=" + redirect_uri;
    }
  } 
  else {
    baseLink = "https://www.facebook.com/sharer/sharer.php?u=";
    shareLink = baseLink + href;
  }

  Template.instance().$(".fb-share").attr("href", shareLink);
});

Template.share_facebook.helpers(Share.helpers);