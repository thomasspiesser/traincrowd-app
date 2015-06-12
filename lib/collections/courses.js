Courses = new Mongo.Collection("courses");

courseSchema = new SimpleSchema({
  owner: {
    type: String,
  	regEx: SimpleSchema.RegEx.Id,
    label: "Owner"
  },
  ownerName: {
    type: String,
    label: "Owner name"
  },
  title: {
    type: String,
    label: "Course title",
    max: 120
  },
  slug: {
    type: String,
    label: "URL slug from course title"
  },
  public: {
    type: Boolean,
    label: "public state",
    autoValue: function () {
      if (this.isInsert) {
       return false;
      }
    }
  },
  publishRequest: {
    type: Boolean,
    label: "has publish request",
    autoValue: function () {
      if (this.isInsert) {
       return false;
      }
    }
  },
  rating: {
    type: Number,
    label: "course rating",
    min: 0,
    max: 5,
    decimal: true,
    optional: true
  },
  ratingDetail: {
    type: [ Number ],
    label: "course rating details",
    decimal: true,
    optional: true
  },
  description: {
    type: String,
    label: "Course description",
    max: 1000
  },
  categories: {
    type: [ String ],
    label: "Course categories"
  },
  imageId: {
    type: String,
    label: "Course image S3 URL",
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  aims: {
    type: String,
    label: "Course aims",
    max: 1000
  },
  methods: {
    type: String,
    label: "Course methods",
    optional: true,
    max: 1000
  },
  targetGroup: {
    type: String,
    label: "Course targetGroup",
    optional: true,
    max: 1000
  },
  prerequisites: {
    type: String,
    label: "Course prerequisites",
    optional: true,
    max: 1000
  },
  languages: {
    type: String,
    label: "Course languages",
    optional: true,
    max: 1000
  },
  additionalServices: {
    type: String,
    label: "Course additionalServices",
    optional: true,
    max: 1000
  },
  maxParticipants: {
    type: Number,
    label: "Course maxParticipants"
  },
  fee: {
    type: Number,
    label: "Course fee",
    decimal: true
  },
  duration: {
    type: Number,
    label: "Course duration",
    decimal: true
  },
  expires: {
    type: Number,
    label: "Deadline when an event of the course expires",
    min: 1,
    max: 4
  },
  dates: {
    type: Array,
    label: "all dates for current events of the course",
    autoValue: function () {
      if (this.isInsert) {
       return [];
      }
    }
  },
  'dates.$': {
    type: [ Date ],
    optional: true
  },
  noLocation: {
    type: Boolean,
    label: "Course location - no location",
    optional: true
  },
  street: {
    type: String,
    label: "Course address - street",
    optional: true,
    max: 100
  },
  streetAdditional: {
    type: String,
    label: "Course address - streetAdditional",
    optional: true,
    max: 100
  },
  streetNumber: {
    type: String,
    label: "Course address - streetNumber",
    optional: true,
    max: 7
  },
  plz: {
    type: String,
    label: "Course address - plz",
    optional: true,
    min: 4,
    max: 9
  },
  city: {
    type: String,
    label: "Course address - city",
    optional: true,
    max: 50
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

Courses.attachSchema(courseSchema);