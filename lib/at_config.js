T9n.setLanguage('de');

AccountsTemplates.configure({
	sendVerificationEmail: true,
	showForgotPasswordLink: true,
	privacyUrl: 'privacy',
	termsUrl: 'agb'
});

AccountsTemplates.configureRoute('signIn',{template: 'login'});
AccountsTemplates.configureRoute('signUp',{template: 'login'});
AccountsTemplates.configureRoute('forgotPwd',{template: 'login'});
AccountsTemplates.configureRoute('resetPwd',{template: 'login'});
AccountsTemplates.configureRoute('verifyEmail',{template: 'login'});

Router.plugin('ensureSignedIn', {
    only: [ 'createCourse', 'course.edit', 'course.confirm', 'user.courses', 'edit.user', 'edit.trainer']
});

var email = AccountsTemplates.removeField('email');
var pwd = AccountsTemplates.removeField('password');

AccountsTemplates.addField({
    _id: "title",
    type: "select",
    displayName: "Titel",
    select: [
    		{
            text: "",
            value: "",
        },
        {
            text: "Frau",
            value: "Frau",
        },
        {
            text: "Herr",
            value: "Herr",
        },
        {
            text: "Dr.",
            value: "Dr.",
        },
        {
            text: "Prof.",
            value: "Prof.",
        },
    ],
});

AccountsTemplates.addField({
    _id: "name",
    type: "text",
    displayName: "Name",
    placeholder: "Max Mustermann",
    required: true,
    trim: true,
    errStr: "Bitte geben Sie Ihren vollständigen Namen an."
});

AccountsTemplates.addField(email);
AccountsTemplates.addField(pwd);
