T9n.setLanguage('de');

AccountsTemplates.configure({
	sendVerificationEmail: true,
	showForgotPasswordLink: true
});

AccountsTemplates.configureRoute('signIn',{template: 'login'});
AccountsTemplates.configureRoute('signUp',{template: 'login'});
AccountsTemplates.configureRoute('forgotPwd',{template: 'login'});
AccountsTemplates.configureRoute('resetPwd',{template: 'login'});
AccountsTemplates.configureRoute('verifyEmail',{template: 'login'});

Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
    only: ['becomeTrainerLanding', 'createCourse', 'course.edit', 'course.confirm', 'user.courses', 'userProfile.edit']
});