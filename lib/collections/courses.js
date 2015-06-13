Courses = new Mongo.Collection("courses");

courseSchema = new SimpleSchema({
  owner: {
    type: String,
  	regEx: SimpleSchema.RegEx.Id,
    label: "Besitzer"
    // label: "Owner"
  },
  ownerName: {
    type: String,
    label: "Besitzer Name"
    // label: "Owner name"
  },
  title: {
    type: String,
    label: "Kurstitel",
    // label: "Course title",
    max: 120
  },
  slug: {
    type: String,
    label: "URL Slug vom Kurstitel"
    // label: "URL slug from course title"
  },
  public: {
    type: Boolean,
    label: "Öffentlichkeitsstatus",
    // label: "public state",
    autoValue: function () {
      if (this.isInsert) {
       return false;
      }
    }
  },
  publishRequest: {
    type: Boolean,
    label: "Anfragestatus Veröffentlichung",
    // label: "has publish request",
    autoValue: function () {
      if (this.isInsert) {
       return false;
      }
    }
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
  ratingDetail: {
    type: [ Number ],
    label: "Bewertungsdetails",
    // label: "course rating details",
    decimal: true,
    optional: true
  },
  description: {
    type: String,
    label: "Beschreibung",
    // label: "Course description",
    max: 1000
  },
  categories: {
    type: [ String ],
    label: "Kategorien",
    // label: "Course categories",
    minCount: 1
  },
  imageId: {
    type: String,
    label: "Bild S3 URL",
    // label: "Course image S3 URL",
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  aims: {
    type: String,
    label: "Lernziele",
    // label: "Course aims",
    max: 1000
  },
  methods: {
    type: String,
    label: "Lernformen, Methodik und Didaktik",
    // label: "Course methods",
    optional: true,
    max: 1000
  },
  targetGroup: {
    type: String,
    label: "Zielgruppe",
    // label: "Course targetGroup",
    optional: true,
    max: 1000
  },
  prerequisites: {
    type: String,
    label: "Vorraussetzungen",
    // label: "Course prerequisites",
    optional: true,
    max: 1000
  },
  languages: {
    type: String,
    label: "Sprachen",
    // label: "Course languages",
    optional: true,
    max: 1000
  },
  additionalServices: {
    type: String,
    label: "zusätzliche Leistungen",
    // label: "Course additionalServices",
    optional: true,
    max: 1000
  },
  maxParticipants: {
    type: Number,
    label: "Teilnehmerzahl"
    // label: "Course maxParticipants"
  },
  fee: {
    type: Number,
    label: "Gesamtpreis",
    // label: "Course fee",
    decimal: true
  },
  duration: {
    type: Number,
    label: "Kursdauer",
    // label: "Course duration",
    decimal: true
  },
  expires: {
    type: Number,
    label: "gewünschte Vorlaufzeit",
    // label: "Deadline when an event of the course expires",
    min: 1,
    max: 4
  },
  dates: {
    type: [[ Date ]],
    label: "Kurstage aller Events",
    // label: "all dates for current events of the course",
    autoValue: function () {
      if (this.isInsert) {
       return [];
      }
    }
  },
  noLocation: {
    type: Boolean,
    label: "Kursort - steht noch nicht fest",
    // label: "Course location - no location",
    optional: true
  },
  street: {
    type: String,
    label: "Kursort - Straße",
    // label: "Course address - street",
    optional: true,
    max: 100
  },
  streetAdditional: {
    type: String,
    label: "Kursort - Adresszusatz",
    // label: "Course address - streetAdditional",
    optional: true,
    max: 100
  },
  streetNumber: {
    type: String,
    label: "Kursort - Hausnummer",
    // label: "Course address - streetNumber",
    optional: true,
    max: 7
  },
  plz: {
    type: String,
    label: "Kursort - PLZ",
    // label: "Course address - plz",
    optional: true,
    min: 4,
    max: 9
  },
  city: {
    type: String,
    label: "Kursort - Stadt",
    // label: "Course address - city",
    optional: true,
    max: 50
  },
  createdAt: {
    type: Date,
    // autoValue: function() {
    //   if (this.isInsert) {
    //     return new Date();
    //   } else {
    //     this.unset();
    //   }
    // }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
});

Courses.attachSchema(courseSchema);