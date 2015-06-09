Elapsed = new Mongo.Collection("elapsed");

elapsedSchema = new SimpleSchema({
  owner: {
    type: String,
  	regEx: SimpleSchema.RegEx.Id,
    label: "Owner"
  },
  ownerName: {
    type: String,
    label: "Owner name"
  },
  course: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Course"
  },
  courseTitle: {
    type: String,
    label: "Course title"
  },
  participants: {
    type: Array,
    label: "Participant Ids"
  },
  'participants.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  courseDate: {
    type: [ Date ],
    label: "Date of the course-event"
  },
  ratings: {
  	type: [ Object ],
  	label: "Array of user rating objects with userId and rating-numbers array",
  	autoValue: function () {
    	if (this.isInsert){
    		return [];
    	}
    }
  },
  "ratings.$.participant": {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  "ratings.$.rating": {
    type: [ Number ]
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

Elapsed.attachSchema(elapsedSchema);