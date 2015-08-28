PAYMILL_PUBLIC_KEY = Meteor.settings.public.paymill.livePublicKey;

var formlang = 'de';

Template.paymillForm.rendered = function () {
  translateForm(formlang);
  $('#cvc-popover').popover();
};

Template.paymillForm.helpers({
  currency: function () {
    if (this.currency) {
      return this.currency;
    }
    return "EUR";
  }
});

function translateForm(language){
  formlang = language;
  var lang;
  if (translation[language] === undefined){
    lang = translation['de'];
  }
  else {
    lang = translation[language];
  }
  $(".card-number-label").text(lang["form"]["card-number"]);
  $(".card-cvc-label").text(lang["form"]["card-cvc"]);
  $(".card-holdername-label").text(lang["form"]["card-holdername"]);
  $(".card-expiry-label").text(lang["form"]["card-expiry"]);
  $(".amount-label").text(lang["form"]["amount"]);
  $(".currency-label").text(lang["form"]["currency"]);
  $(".submit-button").text(lang["form"]["submit-button"]);
  $("#cvc-popover").attr('data-content', lang["form"]["popover"]);
}

var data;

Template.paymillForm.events({
  'submit #paymill-form': function (event, template) {
    event.preventDefault();
    data = this;
    // Deactivate submit button to avoid further clicks
    $('.submit-button').attr("disabled", "disabled");

    if ( false === paymill.validateCardNumber( $('.card-number').val() )) {
      $(".payment_errors").text(translation[formlang]["error"]["invalid-card-number"]);
      $(".payment_errors").css("display","inline-block");
      $(".submit-button").removeAttr("disabled");
      return false;
    }
    var expiry = $('.card-expiry').val();
    expiry = expiry.split("/");
    if(expiry[1] && (expiry[1].length <= 2)){
        expiry[1] = '20'+expiry[1];
    }
    if ( false === paymill.validateExpiry( expiry[0], expiry[1] )) {
      $(".payment_errors").text(translation[formlang]["error"]["invalid-card-expiry-date"]);
      $(".payment_errors").css("display","inline-block");
      $(".submit-button").removeAttr("disabled");
      return false;
    }
    if ( false === paymill.validateHolder( $('.card-holdername').val() )) {
      $(".payment_errors").text(translation[formlang]["error"]["invalid-card-holdername"]);
      $(".payment_errors").css("display","inline-block");
      $(".submit-button").removeAttr("disabled");
      return false;
    }
    if ( false === paymill.validateCvc( $('.card-cvc').val() )) {
      if(VALIDATE_CVC){
        $(".payment_errors").text(translation[formlang]["error"]["invalid-card-cvc"]);
        $(".payment_errors").css("display","inline-block");
        $(".submit-button").removeAttr("disabled");
        return false;
      } 
      else {
        $('.card-cvc').val("000");
      }
    }

    var params = {
      amount_int:     parseInt($('.amount').val().replace(/[\.,]/, '.') * 100),  // required, integer, z.B. "15" für 0,15 Euro 
      currency:       'EUR',    // ISO 4217 e.g. "EUR"
      number:         $('.card-number').val(),  // required, ohne Leerzeichen und Bindestriche
      exp_month:      expiry[0],  // required
      exp_year:       expiry[1],  // required, vierstellig z.B. "2016"
      cvc:            $('.card-cvc').val(), // required
      cardholder:     $('.card-holdername').val() // optional
    };

    paymill.createToken(params, paymillResponseHandler); 

    return false;
  },
  'click #language_switch': function (event) {
    var language = formlang;
    var newimg;
    if (formlang === 'en'){
      newimg = "/paymill/gb.png";
      language = "de";
    } else {
      newimg = "/paymill/de.png";
      language = "en";
    }
    $(event.currentTarget).attr("src", newimg);
    translateForm(language);
  },
  'keyup .card-expiry': function() {
    if ( /^\d\d$/.test( $('.card-expiry').val() )) {
      text = $('.card-expiry').val();
      $('.card-expiry').val(text += "/");
    }
  },
  'keyup .card-number': function() {
    var detector = new BrandDetection();
    var brand = detector.detect($('.card-number').val());
    $(".card-number")[0].className = $(".card-number")[0].className.replace(/paymill-card-number-.*/g, '');
    if (brand !== 'unknown') {
      $('#card-number').addClass("paymill-card-number-" + brand);
      if (!detector.validate($('.card-number').val())) {
        $('#card-number').addClass("paymill-card-number-grayscale");
      }
      if (brand !== 'maestro') {
        VALIDATE_CVC = true;
      } else {
        VALIDATE_CVC = false;
      }
    }
  }
});

function paymillResponseHandler(error, result) {
  if (error) {
    // Displays the error above the form
    $(".payment_errors").text(error.apierror);
    $(".payment_errors").css("display","inline-block");
  } else {
    $(".payment_errors").text("");

    // Output token
    var token = result.token;
    var amount = parseInt($('.amount').val().replace(/[\.,]/, '.') * 100);

    var options = {
      token: token,
      amount: amount,
      bookingId: data.bookingId
    };

    Meteor.call('createTransaction', options, function (error, response) {
      if (error) {
        console.log(error.error);
        toastr.error(error.error);
      }
      else {
        toastr.success('Zahlung erfolgreich.');
        $('#paymill-form')[0].reset();

        Session.set('bookCourseTemplate', "bookCourseShare");
        $('#bookCourseConfirm').parent().removeClass('active');
        $('#bookCourseShare').parent().addClass('active');

        Modal.hide('payModal');
        // Meteor.setTimeout( redirect , 3000 );
      }
    });
    // redirect = function( ) {
    //   Router.go('edit.user', {_id: Meteor.userId()});
    // };
  }
  $(".submit-button").removeAttr("disabled");
}

var translation = {};

//German
//Creditcard
translation["de"] = {};
translation["de"]["form"] = {};
translation["de"]["form"]["card-paymentname"] = 'Kreditkarte';
translation["de"]["form"]["card-number"] = 'Kartennummer';
translation["de"]["form"]["card-cvc"] = 'CVC';
translation["de"]["form"]["card-holdername"] = 'Karteninhaber';
translation["de"]["form"]["card-expiry"] = 'Läuft ab';
translation["de"]["form"]["amount"] = 'Betrag';
translation["de"]["form"]["currency"] = 'Währung';
translation["de"]["form"]["interval"] = 'Interval';
translation["de"]["form"]["offer-name"] = 'Name des Angebots';
translation["de"]["form"]["submit-button"] = 'Bezahlen';
translation["de"]["form"]["popover"] = "Hinter dem CVV-Code bzw. CVC verbirgt sich ein Sicherheitsmerkmal von Kreditkarten, üblicherweise handelt es sich dabei um eine drei- bis vierstelligen Nummer. Der CVV-Code befindet sich auf VISA-Kreditkarten. Der gleiche Code ist auch auf MasterCard-Kreditkarten zu finden, hier allerdings unter dem Namen CVC. Die Abkürzung CVC steht dabei für Card Validation Code. Bei VISA wird der Code als Card Verification Value-Code bezeichnet. Ähnlich wie bei Mastercard und VISA gibt es auch bei Diners Club, Discover und JCB eine dreistellige  Nummer, die meist auf der Rückseite der Karte zu finden ist. Bei Maestro-Karten gibt es mit und ohne dreistelligen CVV. Wird eine Maestro-Karte ohne CVV verwendet kann einfach 000 eingetragen werden. American Express verwendet die CID (Card Identification Number). Dabei handelt es sich um eine vierstellige Nummer, die meist auf der Vorderseite der Karte, rechts oberhalb der Kartennummer zu finden ist.";
//Elv
translation["de"]["form"]["elv-paymentname"] = 'ELV';
translation["de"]["form"]["elv-paymentname-advanced"] = 'SEPA';
translation["de"]["form"]["elv-account"] = 'Kontonummer';
translation["de"]["form"]["elv-holdername"] = 'Kontoinhaber';
translation["de"]["form"]["elv-bankcode"] = 'Bankleitzahl';
translation["de"]["form"]["elv-iban"] = 'IBAN';
translation["de"]["form"]["elv-bic"] = 'BIC';

//Error
translation["de"]["error"] = {};
translation["de"]["error"]["invalid-card-number"] = 'Ungültige Kartennummer';
translation["de"]["error"]["invalid-card-cvc"] = 'Ungültige CVC.';
translation["de"]["error"]["invalid-card-expiry-date"] = 'Ungültiges Gültigkeitsdatum';
translation["de"]["error"]["invalid-card-holdername"] = 'Bitte geben Sie den Karteninhaber an.';
translation["de"]["error"]["invalid-elv-holdername"] = 'Bitte geben Sie den Kontoinhaber an.';
translation["de"]["error"]["invalid-elv-accountnumber"] = 'Bitte geben Sie eine gültige Kontonummer ein.';
translation["de"]["error"]["invalid-elv-bankcode"] = 'Bitte geben Sie eine gültige BLZ ein.';
translation["de"]["error"]["invalid-elv-bic"] = 'Bitte geben Sie eine gültige BIC ein.';
translation["de"]["error"]["invalid-elv-iban"] = 'Bitte geben Sie eine gültige IBAN ein.';

//English
//Creditcard
translation["en"] = {};
translation["en"]["form"] = {};
translation["en"]["form"]["card-paymentname"] = 'Credit card';
translation["en"]["form"]["card-number"] = 'Card number';
translation["en"]["form"]["card-cvc"] = 'CVC';
translation["en"]["form"]["card-holdername"] = 'Card holder';
translation["en"]["form"]["card-expiry"] = 'Expires';
translation["en"]["form"]["amount"] = 'Amount';
translation["en"]["form"]["currency"] = 'Currency';
translation["en"]["form"]["interval"] = 'Interval';
translation["en"]["form"]["offer-name"] = 'Offer Name';
translation["en"]["form"]["submit-button"] = 'Charge';
translation["en"]["form"]["popover"] = "What is a CVV/CVC number? Prospective credit cards will have a 3 to 4-digit number, usually on the back of the card. It ascertains that the payment is carried out by the credit card holder and the card account is legitimate. On Visa the CVV (Card Verification Value) appears after and to the right of your card number. Same goes for Mastercard's CVC (Card Verfication Code), which also appears after and to the right of  your card number, and has 3-digits. Diners Club, Discover, and JCB credit and debit cards have a three-digit card security code which also appears after and to the right of your card number. The American Express CID (Card Identification Number) is a 4-digit number printed on the front of your card. It appears above and to the right of your card number. On Maestro the CVV appears after and to the right of your number. If you don’t have a CVV for your Maestro card you can use 000.";
//Elv
translation["en"]["form"]["elv-paymentname"] = 'Direct debit';
translation["de"]["form"]["elv-paymentname-advanced"] = 'SEPA';
translation["en"]["form"]["elv-account"] = 'Account number';
translation["en"]["form"]["elv-holdername"] = 'Account holder';
translation["en"]["form"]["elv-bankcode"] = 'Bank code';
translation["en"]["form"]["elv-iban"] = 'IBAN';
translation["en"]["form"]["elv-bic"] = 'BIC';

//Error
translation["en"]["error"] = {};
translation["en"]["error"]["invalid-card-number"] = 'Invalid card number.';
translation["en"]["error"]["invalid-card-cvc"] = 'Invalid CVC.';
translation["en"]["error"]["invalid-card-expiry-date"] = 'Invalid expire date.';
translation["en"]["error"]["invalid-card-holdername"] = 'Please enter the card holder name.';
translation["en"]["error"]["invalid-elv-holdername"] = 'Please enter the account holder name.';
translation["en"]["error"]["invalid-elv-accountnumber"] = 'Please enter a valid account number.';
translation["en"]["error"]["invalid-elv-bankcode"] = 'Please enter a valid bank code.';
translation["en"]["error"]["invalid-elv-iban"] = 'Please enter a valid IBAN.';
translation["en"]["error"]["invalid-elv-bic"] = 'Please enter a valid BIC.';
