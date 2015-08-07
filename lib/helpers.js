displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};

displayEmail = function (user) {
	if (user.emails && user.emails[0])
    return user.emails[0].address;
  else
  	return "noEmailFound";
};

calcCommision =  function (fee) {
  return parseFloat(fee) / 100 * 18;
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

allowedCourseFields = ['title', 'description', 'categories', 'aims', 'methods', 'targetGroup', 'prerequisites', 'languages', 'additionalServices', 'maxParticipants', 'fee', 'duration', 'expires', 'noLocation', 'firm', 'street', 'streetAdditional', 'streetNumber', 'plz', 'city', 'imageId'];
allowedUserFields = ['title', 'name', 'email', 'newsletter', 'description', 'mobile', 'phone', 'videoId', 'videoURL', 'homepage', 'certificates', 'employer', 'position', 'industry', 'workExperience', 'imageId', 'languages', 'firm', 'street', 'streetAdditional', 'streetNumber', 'plz', 'city'];

checkExistance = function ( item, context, fields ) {
  if ( ! item )
    throw new Meteor.Error(423, context + " nicht gefunden.");

  for ( var field in fields ) {
    if ( ! item[ field ] )
      throw new Meteor.Error(403, "Feld '" + field + "' von " + context + " nicht gefunden");
  }

};