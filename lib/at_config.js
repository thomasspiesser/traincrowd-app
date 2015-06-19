T9n.setLanguage('de');

AccountsTemplates.configure({
	sendVerificationEmail: true,
	showForgotPasswordLink: true,
	privacyUrl: 'dataProtection',
	termsUrl: 'agb'
});

AccountsTemplates.configureRoute('signIn',{template: 'login'});
AccountsTemplates.configureRoute('signUp',{template: 'login'});
AccountsTemplates.configureRoute('forgotPwd',{template: 'login'});
AccountsTemplates.configureRoute('resetPwd',{template: 'login'});
AccountsTemplates.configureRoute('verifyEmail',{template: 'login'});

Router.plugin('ensureSignedIn', {
    only: [ 'createCourse', 'course.edit', 'course.confirm', 'user.courses', 'edit.user', 'trainerProfile.edit']
});