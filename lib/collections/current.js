Current = new Mongo.Collection("current");

currentSchema = new SimpleSchema({
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
    label: "Participant Ids",
    autoValue: function () {
      if (this.isInsert) {
    	 return [];
      }
    }
  },
  'participants.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  coupons: {
    type: [ Object ],
    label: "Coupons",
    autoValue: function () {
      if (this.isInsert) {
       return [];
      }
    }
  },
  'coupons.$.code': {
    type: String,
    label: "coupon code",
  },
  'coupons.$.expires': {
    type: Date,
    label: "coupon Ablaufdatum",
  },
  'coupons.$.amount': {
    type: Number,
    label: "coupon Betrag",
  },
  'coupons.$.isValid': {
    type: Boolean,
    label: "coupon gültig?",
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
      if (this.isInsert) {
    	 return false;
      }
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

Current.attachSchema(currentSchema);