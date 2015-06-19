var getText = function(id) {
  var text;
  switch (id) {
    case 'editTrainerProfileShortDescription':
      text = "Geht aus Ihrer Beschreibung klar hervor, was Ihr Alleinstellungsmerkmal gegenüber anderen Anbietern ist? Was macht Sie für Ihre Kunden interessant? Sind Sie eher Spezialist oder Generalist? So zutreffend, haben Sie spezielle Branchenerfahrung erwähnt?";
      return text;
    case 'editTrainerProfilePhone': 
      text = "Bitte geben Sie Ihre Telefonnummer samt Städtevorwahl an. Wir geben ihre Telefonnummern natürlich nicht weiter.";
      return text;
    case 'editTrainerProfileMobile':
      text = "Helfen Sie uns Sie zu erreichen, falls z.B. Teilnehmer  Räumlichkeiten nicht finden oder ähnliches. Wir geben ihre Telefonnummern natürlich nicht weiter.";
      return text;
    case 'editTrainerProfileLanguages': 
      text = "Viele Teilnehmer sind an Weiterbildung auf Englisch, Spanisch und anderen Sprachen interessiert. Bitte geben Sie die Sprachen an, in denen sie Ihre Kurse anbieten. Trennen sie die Sprachen durch Kommata.";
      return text;
    case 'editTrainerProfileCertificates':
      text = "Hier können Sie Zertifikate Auswahl Ihrer Referenzen angeben.";
      return text;
    default:
      text = "";
      return text;
  }
};