T9n.setLanguage('de');

AccountsTemplates.configure({
	sendVerificationEmail: true,
	showForgotPasswordLink: true
});

AccountsTemplates.configureRoute('signIn', {
    name: 'atSignIn',
    path: '/sign-in',
    template: 'signIn'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'atSignUp',
    path: '/sign-up',
    template: 'signUp'
});

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'atForgotPwd',
    path: '/forgot-password',
    template: 'forgotPwd'
});

AccountsTemplates.configureRoute('verifyEmail', {
    name: 'atVerifyEmail',
    path: '/verify-email',
    template: 'verifyEmail'
});

Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
    only: ['becomeTrainerLanding', 'createCourse', 'course.edit', 'userCourses', 'userProfile.edit']
});