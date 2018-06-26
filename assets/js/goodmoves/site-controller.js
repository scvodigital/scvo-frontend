var GoodmovesController = Class.extend({
  userProfile: null,
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
          that.getUserProfile(user, function() {});
        });
      } else {
        console.log('User logged out');
        that.userProfile = null;
        that.uid = null;
        that.updateComponents.call(that);
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
    if (this.userProfile) {
      var userProfile = this.userProfile;
      $('[data-vacancy-id]').removeClass('vacancy-shortlisted');
      if (userProfile.goodmoves && userProfile.goodmoves.saved_vacancies) {
        var savedVacancies = userProfile.goodmoves.saved_vacancies;
        var selectors = savedVacancies.map(function(vid) {
          return '[data-vacancy-id="' + vid + '"]';
        });
        $(selectors.join(',')).addClass('vacancy-shortlisted');
      }
    }

    $('[data-collapse-target]').off('click').on('click', function(evt) {
      console.log('Collapse click:', evt);
      var $el = $(evt.currentTarget);
      var selector = $el.attr('data-collapse-target');
      var $target = $(selector);
      var $icon = $el.find('.far');
      if ($target.is(':visible')) {
        $target.hide();
        $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
      } else { 
        $target.show();
        $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
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

function initMap() {
  handleLocationBoxes();
  handleMaps();
}

function handleLocationBoxes() {
  var boxes = $('[data-location-options]');
  boxes.each(function(i, o) {
    var options = $(o).data('location-options');
    var latSelector = $(o).data('location-lat');
    var lngSelector = $(o).data('location-lng');

    var autocomplete = new google.maps.places.Autocomplete(o, options);
    autocomplete.addListener('place_changed', function(evt) {
      var place = this.getPlace();
      // console.log(place.formatted_address);
      if (place.geometry.location) {
        $(latSelector).val(place.geometry.location.lat());
        $(lngSelector).val(place.geometry.location.lng());
        $(o).val(place.formatted_address);
      }
    });
  });
}

function handleMaps() {
  var maps = $('[data-map-options]').each(function(i, o) {
    var options = $(o).data('map-options');
    var map = new google.maps.Map(o, options);

    var pinOptions = $(o).data('map-pins');
    var pinBounds = new google.maps.LatLngBounds();
    var pins = [];

    pinOptions.forEach(function(pinOption) {
      var markerOptions = {
        map: map,
        position: {
          lat: pinOption.coords.lat,
          lng: pinOption.coords.lon
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 15,
          fillColor: '#58a934',
          fillOpacity: 0.6,
          strokeColor: '#3c7524',
          strokeOpacity: 0.8,
          strokeWeight: 2
        },
        title: pinOption.title,
        opacity: 1
      };
      var infoWindowOptions = {
        content: decodeURIComponent(pinOption.info_window),
      };

      var marker = new google.maps.Marker(markerOptions);
      var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
      marker.addListener('click', function() {
        pins.forEach(function(pin) {
          pin.infoWindow.close();
        });
        infoWindow.open(map, marker);
      });
      
      pins.push({
        marker: marker,
        infoWindow: infoWindow
      });
      pinBounds.extend(markerOptions.position);
    }); 
  });
}
