var GoodmovesController = Class.extend({
  userProfile: null,
  savedSearches: [],
  uid: null,
  app: null,
  config: null,
  displayMode: null,
  displayModes: [
    { name: 'mobile', min: 0, max: 599 },
    { name: 'tablet', min: 600, max: 959 },
    { name: 'desktop', min: 960, max: 20000 }
  ],

  init: function(firebaseConfig) {
    this.firebaseConfig = firebaseConfig;
    this.setupMaterialDesignComponents();
    this.setupFirebase();

    var that = this;
    $(window).on('resize', function() {
      that.windowResized.call(that);
    });
    this.windowResized();
  },

  windowResized: function() {
    var width = $(window).width();
    var newDisplayMode = null;
    this.displayModes.forEach(function(mode) {
      if (width >= mode.min && width < mode.max) {
        newDisplayMode = mode.name;
      }
    });
    if (newDisplayMode !== this.displayMode) {
      this.displayMode = newDisplayMode;
      this.displayModeChanged();
    }
  },

  displayModeChanged: function() {
    console.log('Display Mode:', this.displayMode);
  },

  setupMaterialDesignComponents: function() {
    mdc.autoInit();

    // Menu buttons
    $('[data-menu-target]').each(function(i, o) {
      var selector = $(o).attr('data-menu-target');
      var menuEl = $(selector)[0];
      $(o).on('click', function() {
        menuEl.MDCMenu.open = !menuEl.MDCMenu.open;
      });
    });

    // Temporary drawer buttons
    $('[data-drawer-target]').each(function(i, o) {
      var selector = $(o).attr('data-drawer-target');
      var drawerEl = $(selector)[0];
      var drawerType = $(selector).attr('data-mdc-auto-init');
      if (drawerType) {
        $(o).on('click', function() {
          drawerEl[drawerType].open = !drawerEl[drawerType].open;
        });
      }
    });
  },

  setupFirebase: function() {
    // Initialize Firebase
    this.app = firebase.initializeApp(this.firebaseConfig);
    var that = this;
    // Firebase Auth Functions
    this.app.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('User logged in', user);
        that.uid = user.uid;
        user.getIdToken().then(function(idToken) {
          that.setCookie('gm_token', idToken, 7);
          that.getUserProfile(user, function() {
            that.getSavedSearches(user);
          });
        });
      } else {
        console.log('User logged out');
        that.userProfile = null;
        that.uid = null;
      }
    });
  },

  // Utility functions
  setCookie: function(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; secure";
  },

  getUserProfile: function(user, cb) {
    var that = this;
    this.app.database().ref('/users/' + user.uid).once('value').then(function(response) {
      if (response.exists()) {
        that.userProfile = response.val();
        that.userProfile.email = user.email;
        that.userProfile.displayName = user.displayName;
        console.log(that.userProfile);
        that.setUserProfileDefaults().then(function() { }).catch(function(err) { });
      } else {
        console.error('User profile does not exist');
      }
      if (cb) cb.call(that);
    }).catch(function(err) {
      console.error('Failed to get user profile info', err);
    });
  },

  getSavedSearches: function(user, cb) {
    if (!user.email) return;
    var that = this;
    var url = 'https://scvo.net/subscriber/' + user.email + '/goodmoves-weekly';
    $.getJSON(url, function(response) {
      that.savedSearches = [];
      if (response.message === 'Found') {
        response.subscriptions.forEach(function(subscription) {
          var savedSearch = new SavedSearch(subscription);
          that.savedSearches.push(savedSearch);
        });        
      }
      if (cb) cb.call(that);
    });
  },

  updateComponents: function() {
    var userProfile = this.userProfile;
    $('[data-vacancy-id]').removeClass('vacancy-shortlisted');
    if (userProfile.goodmoves && userProfile.goodmoves.saved_vacancies) {
      var savedVacancies = userProfile.goodmoves.saved_vacancies;
      var selectors = savedVacancies.map(function(vid) {
        return '[data-vacancy-id="' + vid + '"]';
      });
      $(selectors.join(',')).addClass('vacancy-shortlisted');
    }

    console.log($('[data-collapse-target]'));
    $('[data-collapse-target]').off('click').on('click', function(evt) {
      console.log('Collapse click:', evt);
      var $el = $(evt.currentTarget);
      var selector = $el.attr('data-collapse-target');
      var $target = $(selector);
      var $icon = $el.find('.far');
      if ($target.is(':visible')) {
        $target.hide();
        $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
      } else { 
        $target.show();
        $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
      }
    });
  },

  setUserProfileDefaults: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      var userProfile = that.userProfile;
      userProfile.goodmoves = userProfile.goodmoves || {};
      userProfile.goodmoves.saved_vacancies = userProfile.goodmoves.saved_vacancies || [];
      if (userProfile === that.userProfile) {
        that.updateComponents();
        resolve();
      } else {
        that.updateUserProfile(userProfile).then(function(userProfile) {
          console.log('Saved default Goodmoves profile');
          resolve();
        }).catch(function(err) {
          console.error('Error saving default Goodmoves profile', err);
          resolve();
        });
      }
    });
  },

  updateUserProfile: function(userProfile) {
    var that = this;
    return new Promise(function(resolve, reject) {
      var path = '/users/' + that.uid;
      that.app.database().ref(path).update(that.userProfile).then(function() {
        console.log('User profile updated', path);
        that.userProfile = userProfile;
        that.updateComponents();
        resolve();
      }).catch(function(err) {
        console.error('Failed to update user profile:', path, this.userProfile);
        reject();
      });
    });
  },

  toggleShortlistItem: function(id) {
    var userProfile = this.userProfile;
    var shortlist = userProfile.goodmoves.saved_vacancies;
    var index = shortlist.indexOf(id);
    if (index > -1) {
      shortlist.splice(index, 1);
    } else {
      shortlist.push(id);
    }
    userProfile.goodmoves.saved_vacancies = shortlist;
    this.updateUserProfile(userProfile).then(function() {
      console.log('Shortlist updated');
    }).catch(function(err) {
      console.error('Failed to update shortlist', err);
    });
  },

  saveSearch: function() {
    var newSearch = new SavedSearch('TEST NAME');
    this.savedSearches.push(newSearch);
  }
});

var goodmoves = null;
$(document).ready(function() {
  goodmoves = new GoodmovesController({
      apiKey: "AIzaSyDIUNnyGeZY3sO8gGIf-_2dgO49xKij5zI",
      authDomain: "scvo-net.firebaseapp.com",
      databaseURL: "https://scvo-net.firebaseio.com",
      projectId: "scvo-net",
      storageBucket: "scvo-net.appspot.com",
      messagingSenderId: "782194712584"
    });
});

var SavedSearch = Class.extend({
  id: null,
  email: null,
  name: null,
  suppressed: 0,
  subscribed: 0,
  searchQuery: {},
  subscriptionName: 'None',
  lastSent: null,
  lastResponse: null,
  failCount: 0,
  updatedAt: null,
  createdAt: null,

  init: function(savedSearch) {
    if (typeof savedSearch === 'string') {
      this.subscriptionName = savedSearch;
      this.subscribed = 0;
      this.searchQuery = searchQuery;
      this.setDefaults();
      console.log('Created Saved Search:', this);
    } else if(savedSearch) {
      Object.assign(this, savedSearch);
      this.setDefaults();
      console.log('Loaded Saved Search:', this);
    }
  },

  setDefaults: function() {
    this.id = 'goodmoves-weekly';
    this.email = goodmoves.userProfile.email;
    this.name = goodmoves.userProfile.displayName || goodmoves.userProfile.email,
    this.originUid = goodmoves.uid,
    this.origin = 'goodmoves-firebase'
  },

  save: function(user) {
    var body = {
      id: this.id,
      email: this.email,
      name: this.name,
      subscribed: this.subscribed,
      searchQuery: this.searchQuery,
      subscriptionName: this.subscriptionName,
      originUid: this.originUid,
      origin: this.origin
    };
  },

  isCurrent: function() {
    var normalMe = normaliseQuery(this.searchQuery);
    var normalCurrent = normaliseQuery(searchQuery);

    var match = 
      normalMe.lat === normalCurrent.lat &&
      normalMe.lng === normalCurrent.lng &&
      normalMe.keywords === normalCurrent.keywords &&
      normalMe.distance === normalCurrent.distance;

    if (!match) return false;

    if (!simpleArrayCompare(normalMe.roles, normalCurrent.roles)) return false;
    if (!simpleArrayCompare(normalMe.sectors, normalCurrent.sectors)) return false;
    if (!simpleArrayCompare(normalMe.statuses, normalCurrent.statuses)) return false;
    if (!simpleArrayCompare(normalMe.regions, normalCurrent.regions)) return false;

    return true;
  }
});

function simpleArrayCompare(arr1, arr2) {
  if (arr1.length === 0 && arr2.length === 0) return true;

  var reduced1 = [];
  var reduced2 = [];

  arr1.forEach(function(item) {
    if (reduced1.indexOf(item) === -1) {
      reduced1.push(item);
    }
  });

  arr2.forEach(function(item) {
    if (reduced2.indexOf(item) === -1) {
      reduced2.push(item);
    }
  });

  reduced1 = reduced1.sort();
  reduced2 = reduced2.sort();

  if (reduced1.length !== reduced2.length) return false;

  for (var i = 0; i < reduced1.length; i++) {
    if (reduced1[i] !== reduced2[i]) return false;
  }

  return true;
}

function normaliseQuery(query) {
  var normalised = {
    roles: [],
    sectors: [],
    statuses: [],
    regions: [],
    keywords: '',
    lat: null,
    lng: null,
    distance: null,
    minimumSalary: null,
    maximumSalary: null
  };

  if (!query.bool) return normalised;

  if (query.bool.filter) {
    for (var i = 0; i < query.bool.filter.length; i++) {
      var part = query.bool.filter[i];
      if (part.terms) {
        var terms = getTerms(part.terms);
        if (terms.field.indexOf('role') > -1) {
          normalised.roles = normalised.roles.concat(terms.terms);
        } else if (terms.field.indexOf('status') > -1) {
          normalised.statuses = normalised.statuses.concat(terms.terms);
        } else if (terms.field.indexOf('sector') > -1) {
          normalised.sectors = normalised.sectors.concat(terms.terms);
        } else if (terms.field.indexOf('region') > -1) {
          normalised.regions = normalised.regions.concat(terms.terms);
        }
      }
    }
  }
  
  if (query.bool.must) {
    for (var i = 0; i < query.bool.must.length; i++) {
      var part = query.bool.must[i];
      if (part.terms) {
        var terms = getTerms(part.terms);
        if (terms.field.indexOf('role') > -1) {
          normalised.roles = normalised.roles.concat(terms.terms);
        } else if (terms.field.indexOf('status') > -1) {
          normalised.statuses = normalised.statuses.concat(terms.terms);
        } else if (terms.field.indexOf('sector') > -1) {
          normalised.sectors = normalised.sectors.concat(terms.terms);
        } else if (terms.field.indexOf('region') > -1) {
          normalised.regions = normalised.regions.concat(terms.terms);
        }
      }
    }
  }

  return normalised;
}

function getTerms(termsQuery) {
  var field = Object.keys(termsQuery)[0];
  var terms = {
    field: field,
    terms: termsQuery[field].map(function(term) {
      return S(term).slugify().s;
    })
  };
  return terms;
}
