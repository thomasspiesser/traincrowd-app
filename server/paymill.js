var secret = Meteor.settings.paymill.testPrivateKey;
paymill = paymill(secret);

Meteor.methods({
  createTransaction: function (options) {
    check(options, {
      token: NonEmptyString,
      amount: Number
    });

    var paymillCreateTransactionSync = Meteor.wrapAsync(paymill.transactions.create);

    try{
      var result = paymillCreateTransactionSync({
        amount: options.amount,
        currency: 'EUR',
        token: options.token,
        description: 'Test Transaction'
      });
      return result;
    }
    catch(error){
      return error;
    }
    
  }
});
