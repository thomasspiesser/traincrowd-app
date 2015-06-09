Current = new Mongo.Collection("current");

currentSchema = new SimpleSchema({
  owner: {
    type: String,
  	regEx: SimpleSchema.RegEx.Id,
    label: "Owner",
    max: 200
  },
  course: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Course"
  },
  participants: {
    type: Array,
    label: "Participant Ids",
    autoValue: function () {
    	return [];
    }
  },
  'participants.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  courseDate: {
    type: [ Date ],
    label: "Date of the course-event"
  },
  token: {
  	type: String,
  	optional: true
  },
  confirmed: {
  	type: Boolean,
  	autoValue: function () {
    	return false;
    }
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
  }
});

Current.attachSchema(currentSchema);