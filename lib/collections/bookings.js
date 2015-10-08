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
  seats: {
    type: Number,
    label: "Anzahl Kursplätze",
    autoValue: function () {
      if (this.isInsert) {
       return 1;
      }
    }
  },
  additionalCustomers: {
    type: [ String ],
    label: "zusätzliche Kunden"
  },
  trainer: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Trainer"
  },
  trainerName: {
    type: String,
    label: "Trainername"
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
  courseFeePP: {
    type: Number,
    label: "Kurspreis pro Person in Euro",
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
    allowedValues: ['inProgress', 'completed', 'canceledByUs', 'canceledByCustomer'],
    autoValue: function () {
      if (this.isInsert) {
       return 'inProgress';
      }
    }
  },
  paymentMethod: {
    type: String,
    allowedValues: ['Kreditkarte', 'Rechnung'],
    label: "Bezahlform"
  },
  hasShared: {
    type: Boolean,
    label: "Social-sharing Status"
  },
  coupon: {
    type: Object,
    label: "Coupon",
    optional: true
  },
  'coupon.code': {
    type: String,
    label: "coupon code"
  },
  'coupon.amount': {
    type: Number,
    label: 'coupon Betrag'
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