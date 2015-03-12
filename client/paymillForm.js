Template.paymillForm.helpers({
  foo: function () {
    // ...
  }
});

Template.paymillForm.events({
  'submit #payment-form': function (event, template) {
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
    }, PaymillResponseHandler);                   // Info dazu weiter unten

    return false;
  }
});


