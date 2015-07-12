Share = {
  settings: {
    buttons: 'responsive',
    sites: {
      'facebook': {
        'appId': null,
        'description': '',
        'use': false
      },
      'twitter': {
        'description': '',
        'use': false
      },
      'googleplus': {
        'description': '',
        'use': false
      },
      'pinterest': {
        'description': '',
        'use': false
      },
      'instagram': {
        'description': '',
        'use': false
      },
      'linkedin': {
        'description': '',
        'use': false
      },
      'xing': {
        'description': '',
        'use': false
      },
      'whatsapp': {
        'description': '',
        'use': false
      },
      'mail': {
        'description': '',
        'use': false
      }
    },
    siteOrder: ['facebook', 'twitter', 'linkedin', 'xing', 'instagram', 'pinterest', 'googleplus', 'whatsapp', 'mail'],
    classes: "large btn",
    iconOnly: false,
    faSize: '',
    faClass: '',
    applyColors: true
  },
  configure: function(hash) {
    return this.settings = $.extend(true, this.settings, hash);
  },
  helpers: {
    classes: function() {
      return Share.settings.classes;
    },
    showText: function() {
      return !Share.settings.iconOnly;
    },
    applyColors: function() {
      return Share.settings.applyColors;
    },
    faSize: function() {
      return Share.settings.faSize;
    },
    faClass: function() {
      if (!!Share.settings.faClass) {
        return '-' + Share.settings.faClass;
      } else {
        return '';
      }
    }
  }
};

this.Share = Share;

Share.init = function(hash) {
  this.settings = $.extend(true, this.settings, hash);
};