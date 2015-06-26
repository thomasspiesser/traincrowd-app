Bookings = new Mongo.Collection("bookings");

bookingSchema = new SimpleSchema({
  customer: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Kunden Id"
    // label: "Owner"
  },
  customerName: {
    type: String,
    label: "Kundenname"
    // label: "Owner name"
  },
  transaction: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Paymill-Transaktion Id"
  },
  transactionDate: {
    type: Date,
    label: "Zeitstempel der Paymill-Transaktion"
  },
  amount: {
    type: Number,
    label: "Bezahlter Betrag in Euro",
    decimal: true
  },
  trainer: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Owner"
  },
  trainerName: {
    type: String,
    label: "Owner name"
  },
  course: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Kurs Id"
  },
  courseTitle: {
    type: String,
    label: "Kurstitel"
  },
  courseFee: {
    type: Number,
    label: "Kurszahlbetrag in Euro",
    decimal: true
  },
  eventId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Event Id"
  },
  eventDate: {
    type: [ Date ],
    label: "Eventdatum"
  },
  eventConfirmed: {
    type: Boolean,
    autoValue: function () {
      if (this.isInsert) {
       return false;
      }
    }
  },
  billingAddress: {
    type: addressSchema,
    label: "Rechnungsadresse",
  },
  bookingStatus: {
    type: String,
    allowedValues: ['inProcess', 'completed', 'canceledByUs', 'canceledByCustomer'],
    autoValue: function () {
      if (this.isInsert) {
       return 'inProcess';
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

// bookingSchema = new SimpleSchema([bookingSchema]);

Bookings.attachSchema(bookingSchema);