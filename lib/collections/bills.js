Bills = new Mongo.Collection('bills');

billsSchema = new SimpleSchema({
  bookingId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Buchungs Id',
  },
  customer: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Kunden Id',
  },
  customerName: {
    type: String,
    label: 'Kundenname',
  },
  number: {
    type: Number,
    label: 'Rechnungsnummer',
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    },
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
});

Bills.attachSchema(billsSchema);
