calcCommision =  function ( fee ) {
  return parseFloat( fee ) / 100 * 18;
};

noIndent = function( str ) {
  return str.replace(/  +/g, ' ');
};

EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

NonEmptyString = Match.Where(function (x) {
  check(x, String);
  if ( x.length === 0) {
  	throw new Meteor.Error(500, "Match failed. Empty String");
  }
  else
  	return true;
});

allowedCourseFields = ['title', 'description', 'categories', 'aims', 'methods', 'targetGroup', 'prerequisites', 'languages', 'additionalServices', 'maxParticipants', 'fee', 'taxRate', 'duration', 'expires', 'noLocation', 'firm', 'street', 'streetAdditional', 'streetNumber', 'plz', 'city', 'imageId'];
allowedUserFields = ['title', 'name', 'email', 'newsletter', 'description', 'taxNumber', 'mobile', 'phone', 'videoId', 'videoURL', 'homepage', 'certificates', 'employer', 'position', 'industry', 'workExperience', 'imageId', 'languages', 'firm', 'street', 'streetAdditional', 'streetNumber', 'plz', 'city'];

checkExistance = function ( item, context, fields ) {
  if ( ! item )
    throw new Meteor.Error(423, context + " nicht gefunden.");

  for ( var field in fields ) {
    if ( item[ field ] == null )
      throw new Meteor.Error(403, "Feld '" + field + "' von " + context + " nicht gefunden");
  }
};

checkExistanceSilent = function ( item, context, query, fields ) {
  if ( ! item ) {
    console.log("ERROR: " + context + " not found with query parameter: " + query );
    return false;
  }

  for ( var field in fields ) {
    if ( item[ field ] == null ) {
      console.log("ERROR: " + "field '" + field + "' from " + context + " not found with query parameter: " + query );
      return false;
    }
  }
  return true;
};