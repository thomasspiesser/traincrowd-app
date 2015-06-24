addressSchema = new SimpleSchema({
  firm: {
    type: String,
    label: "Ort - Firma",
    // label: "Course address - firm",
    optional: true,
    max: 100
  },
  street: {
    type: String,
    label: "Ort - Straße",
    // label: "Course address - street",
    optional: true,
    max: 100
  },
  streetAdditional: {
    type: String,
    label: "Ort - Adresszusatz",
    // label: "Course address - streetAdditional",
    optional: true,
    max: 100
  },
  streetNumber: {
    type: String,
    label: "Ort - Hausnummer",
    // label: "Course address - streetNumber",
    optional: true,
    max: 7
  },
  plz: {
    type: String,
    label: "Ort - PLZ",
    // label: "Course address - plz",
    optional: true,
    min: 4,
    max: 9
  },
  city: {
    type: String,
    label: "Ort - Stadt",
    // label: "Course address - city",
    optional: true,
    max: 50
  }
});

publicStateSchema = new SimpleSchema({
  isPublic: {
    type: Boolean,
    label: "Öffentlichkeitsstatus",
    // label: "isPublic state",
    autoValue: function () {
      if (this.isInsert) {
       return false;
      }
    }
  },
  hasPublishRequest: {
    type: Boolean,
    label: "Anfragestatus Veröffentlichung",
    // label: "has publish request",
    autoValue: function () {
      if (this.isInsert) {
       return false;
      }
    }
  }
});

sharedSchema = new SimpleSchema({
  imageId: {
    type: String,
    label: "Bild S3 URL",
    // label: "Course image S3 URL",
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    max: 300
  },
  languages: {
    type: String,
    label: "Sprachen",
    // label: "Course languages",
    optional: true,
    max: 1000
  },
  rating: {
    type: Number,
    label: "Bewertung",
    // label: "course rating",
    min: 0,
    max: 5,
    decimal: true,
    optional: true
  },
});