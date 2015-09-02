Meteor.methods({
	createUserServer: function ( options ) {
		if ( this.userId )
			throw new Meteor.Error(444, "Sie sind bereits eingelogged.");

		check(options, {
			email: String,
			password: {
				digest: String,
				algorithm: String
			},
			profile: Match.Optional( Object )
		});

		if (! EMAIL_REGEX.test( options.email ))
      throw new Meteor.Error(403, "Bitte überprüfen Sie, ob Sie eine echte Email Adresse eingegeben haben.");

    // create user
		var userId = Accounts.createUser( { email: options.email, password : options.password, profile: options.profile } );
		// safety belt. createUser is supposed to throw on error. send 500 error
    // instead of sending a verification email with empty userid.
		if ( ! userId )
			throw new Meteor.Error(444, "Beim Erstellung des Nutzerkontos ist ein Fehler aufgetreten.");
		// else 
		// 	Accounts.sendVerificationEmail( userId, options.email );
		
		return userId;                

	}
});