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
    max: 1500
  },
  categories: {
    type: [ String ],
    label: "Kategorien",
    // label: "Course categories",
    minCount: 1
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
    autoValue: function () {
      if (this.isInsert) {
       return 0;
      }
    }
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
  hasDate: {
    type: Boolean,
    label: "Status zu aktuellen Events",
    autoValue: function () {
      if (this.isInsert) {
       return false;
      }
    }
  },
  noLocation: {
    type: Boolean,
    label: "Kursort - steht noch nicht fest",
    // label: "Course location - no location",
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    }
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

courseSchema = new SimpleSchema([courseSchema, addressSchema, publicStateSchema, sharedSchema]);

Courses.attachSchema(courseSchema);