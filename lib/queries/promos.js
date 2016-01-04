topCourses = {
  _id: {
    $in: [
      'WxTnfKt7BQiqmeTvZ', // illing - neues jahr
      'rGDzzCPhsAxRHoxS3', // betahouse - make better managerial decisions
      '7sRyr4sSu7SaPRNFb', // changer - Berufswechsel
      'MrcpCxKpXDZPpityE', // rainmaiking loft - digital disruption
      'sC3KSEWQqyTwxi8Rd', // witt - living working germany
      'rkJTSDjc2jaYuBp7R', // herzog - chef
    ],
  },
};

topTrainer = {
  find: {
    'profile.name': {
      $in: [
        'Der Hauptstadtcoach',
        'Karin Seven',
        'Tina Gadow',
        'Hartmann Rhetorik GmbH',
      ],
    },
  },
  options: {
    fields: {
      'profile.name': 1,
      'profile.imageId': 1,
    },
  },
};
