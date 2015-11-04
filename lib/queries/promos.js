topCourses = {
  '_id': { 
    $in: [
      '5XwEGvJvzsK9in6cM', // illing - fortuna canvas
      'vhBN3aXc8S6tL32LN', // social entre academy - wie berichte ich
      'PBXJymNQzTdFpADEC', // changer - eu negotiation
      'riZpSyWvdMWMfKhyC', // ruehl - bilanzen lesen
      'sC3KSEWQqyTwxi8Rd', // witt - living working germany
      'rkJTSDjc2jaYuBp7R' // herzog - chef
    ] 
  }
};

topTrainer = {
  find: { 
    'profile.name': { 
      $in: [
        'Der Hauptstadtcoach', 
        'Karin Seven', 
        'Tina Gadow', 
        'Hartmann Rhetorik GmbH'
      ] 
    } 
  },
  options: {
    fields: { 
      'profile.name': 1, 
      'profile.imageId': 1 
    }
  }
};