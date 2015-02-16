//////////// login template /////////

// Template.login.events({
//   'click #signUpButton' : function(e, t) {
//     var email = t.find('#account-email').value;
//     var password = t.find('#account-password').value;
//     var email = trimInput(email);

//     Accounts.createUser({email: email, password : password}, function(err){
//       if (err) {
//         Session.set( "createError", "Sorry, "+err.reason );
//       } else {
//         Session.set( "createError", '' );
//         $('#loginModal').modal('hide');
//       }
//     });
//     return false;
//   },
//   'click #logInButton' : function(e, t) {
//     var email = t.find('#account-email').value;
//     var password = t.find('#account-password').value;
//     var email = trimInput(email);

//     Meteor.loginWithPassword(email, password, function(err){
//       if (err) {
//         Session.set( "createError", "Sorry, "+err.reason );
//       } else {
//         Session.set( "createError", '' );
//         $('#loginModal').modal('hide');
//       }
//     });
//     return false;
//   }
// });