Utils = new Mongo.Collection("utils");

utilsSchema = new SimpleSchema({
  billingCount: {
    type: Number,
    label: "Fortlaufende Rechnungsnummern"
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

Utils.attachSchema(utilsSchema);