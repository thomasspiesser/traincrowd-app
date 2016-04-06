const appId = Meteor.settings.kadira.id;
const appSecret = Meteor.settings.kadira.secret;

if ( process.env.NODE_ENV === 'production' )
	Kadira.connect(appId, appSecret);