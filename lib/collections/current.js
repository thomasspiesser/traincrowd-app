Current = new Mongo.Collection("current");

Current.helpers({
  getPrettyDates: function () {
    return _.map( this.courseDate, function( date ){ return moment( date ).format( "DD.MM.YYYY" ); } );
  },
  getPrettyDateRange: function() {
    if ( this.courseDate.length === 1 )
      return moment( this.courseDate[0] ).format("DD.MM.YYYY");
    if ( this.courseDate.length > 1 )
      return moment( _.first( this.courseDate ) ).format("DD.MM") + ' - ' + moment( _.last( this.courseDate ) ).format("DD.MM.YYYY");
  },
});

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
      if ( this.isInsert) {
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