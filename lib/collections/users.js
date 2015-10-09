Meteor.users.helpers({
  canEdit: function () {
    return Meteor.userId() === this._id;
  },
  getEmail: function () {
    return this.emails[0].address;
  },
  getName: function () {
    return this.profile && this.profile.name || this.emails[0].address;
  }
});

userProfileSchema = new SimpleSchema({
  // firstName: {
  //   type: String,
  //   regEx: /^[a-zA-Z-]{2,25}$/,
  //   optional: true
  // },
  // lastName: {
  //   type: String,
  //   regEx: /^[a-zA-Z]{2,25}$/,
  //   optional: true
  // },
  name: {
    type: String,
    label: "Name",
    regEx: /^[a-zA-Z- äöüß]{2,50}$/,
    optional: true
  },
  description: {
    type: String,
    label: "Beschreibung",
    max: 2500,
    optional: true
  },
  mobile: {
    type: String,
    label: "Handynummer",
    optional: true,
    max: 20
  },
  phone: {
    type: String,
    label: "Telefonnummer",
    optional: true,
    max: 20
  },
  taxNumber: {
    type: String,
    label: "Steuernummer",
    optional: true,
    max: 20
  },
  title: {
    type: String,
    label: "Titel",
    allowedValues: ['Herr', 'Frau', 'Dr.', 'Prof.'],
    optional: true
  },
  videoId : {
    type: String,
    label: "Video Id",
    optional: true,
    max: 50
  },
  videoURL: {
    type: String,
    label: "Video URL",
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  homepage: {
    type: String,
    label: "Homepage",
    optional: true,
    max: 300
  },
  certificates: {
    type: String,
    label: "Zertifikate und Referenzen",
    optional: true,
    max: 1000
  },
  employer: {
    type: String,
    label: "Arbeitgeber",
    optional: true,
    max: 200
  },
  position: {
    type: String,
    label: "Position",
    optional: true,
    max: 200
  },
  industry: {
    type: String,
    label: "Branche",
    optional: true,
    max: 200
  },
  workExperience: {
    type: String,
    label: "Arbeitserfahrung",
    optional: true,
    allowedValues: ["0-5","6-10","11-15","über 15"]
  },
  billingAddresses: {
    type: [ addressSchema ],
    autoValue: function() {
      if (this.isInsert) {
        return [];
      }
    },
    optional: true,
    maxCount: 5
  },
  selectedBillingAddress: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0;
      }
    },
    max: 3
  }
});

userProfileSchema = new SimpleSchema([ userProfileSchema, sharedSchema ]);

userDateSchema = new SimpleSchema({
  createdAt: {
    type: Date,
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

userSchema = new SimpleSchema({
  emails: {
    type: [Object],
    // this must be optional if you also use other login services like facebook,
    // but if you use only accounts-password, then it can be required
    // optional: true
  },
  "emails.$.address": {
    type: String,
    label: "Email-Adresse",
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  profile: {
    type: userProfileSchema,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: [ String ],
    optional: true
  }
});

userSchema = new SimpleSchema([userSchema, publicStateSchema, userDateSchema]);

Meteor.users.attachSchema(userSchema);