Elapsed = new Mongo.Collection("elapsed");

Elapsed.helpers({
  getPrettyDates: function () {
    return _.map( this.courseDate, function( date ){ return moment( date ).format( "DD.MM.YYYY" ); } );
  }
});

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
  "ratings.$.values": {
    type: [ Number ],
    decimal: true
  },
  "ratings.$.recommendation": {
    type: String,
    label: 'Weiterempfehlung',
    optional: true
  },
  "ratings.$.comment": {
    type: String,
    label: 'sonstige Kommentare',
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

Elapsed.attachSchema(elapsedSchema);