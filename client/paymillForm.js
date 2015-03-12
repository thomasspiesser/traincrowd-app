PAYMILL_PUBLIC_KEY = Meteor.settings.public.paymill.testPublicKey;

Template.paymillForm.helpers({
  foo: function () {
    // ...
  }
});

Template.paymillForm.events({
  'submit #paymill-form': function (event, template) {
    event.preventDefault();
    // Deactivate submit button to avoid further clicks
    $('.submit-button').attr("disabled", "disabled");

    paymill.createToken({
      number: $('.card-number').val(),  // required, ohne Leerzeichen und Bindestriche
      exp_month: $('.card-expiry-month').val(),   // required
      exp_year: $('.card-expiry-year').val(),     // required, vierstellig z.B. "2016"
      cvc: $('.card-cvc').val(),                  // required
      amount_int: $('.card-amount-int').val(),    // required, integer, z.B. "15" für 0,15 Euro 
      currency: $('.card-currency').val(),    // required, ISO 4217 z.B. "EUR" od. "GBP"
      cardholder: $('.card-holdername').val() // optional
    }, paymillResponseHandler);                   // Info dazu weiter unten

    return false;
  }
});


function paymillResponseHandler(error, result) {
  if (error) {
    // Displays the error above the form
    console.log(error);
    $(".payment-errors").text(error.apierror);
  } else {
    console.log('success');

    var form = $("#paymill-form");
    console.log(form);
    // Output token
    var token = result.token;

    // Submit form
    var options = {
      token: token,
      amount: 20
    };
    Meteor.call('createTransaction', options, function (error, result) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(result);
        // $('#paymill-form')[0].reset();
      }
    });
  }
  $(".submit-button").removeAttr("disabled");
}