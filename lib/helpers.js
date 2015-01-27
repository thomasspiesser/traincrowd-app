reformatDate = function(date) { // expects string 'date' of type dd.mm.yyyy
  return date.slice(6,10) +'.'+ date.slice(3,6) + date.slice(0,2); // return of type yyyy.mm.dd
}

displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};

displayEmail = function (user) {
	if (user.emails && user.emails[0])
    return user.emails[0].address;
  else
  	return "noEmailFound"
};

NonEmptyString = Match.Where(function (x) {
  check(x, String);
  if (!x.length > 0) {
  	throw new Meteor.Error(500,"Match failed. Empty String");
  }
  else
  	return true;
});