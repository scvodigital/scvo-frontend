var GoodmovesController = Class.extend({
  userProfile: null,
  uid: null,
  app: null,
  config: null,

  init: function(firebaseConfig) {
    this.firebaseConfig = firebaseConfig;
    this.setupMaterialDesignComponents();
    this.setupFirebase();
  },
  
  setupMaterialDesignComponents: function() {
    mdc.autoInit();

    // Menu buttons
    $('[data-menu-target]').each(function(i, o) {
      let selector = $(o).attr('data-menu-target');
      let menuEl = $(selector)[0];
      $(o).on('click', function() {
        menuEl.MDCMenu.open = !menuEl.MDCMenu.open;
      });
    });

    // Temporary drawer buttons
    $('[data-drawer-target]').each(function(i, o) {
      let selector = $(o).attr('data-drawer-target');
      let drawerEl = $(selector)[0];
      $(o).on('click', function() {
        drawerEl.MDCTemporaryDrawer.open = true;
      });
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
          that.getUserProfile(user);
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


  getUserProfile: function(user) {
    var that = this;
    this.app.database().ref('/users/' + user.uid).once('value').then(function(response) {
      if (response.exists()) {
        that.userProfile = response.val();
        console.log(that.userProfile);
        that.setUserProfileDefaults().then(function() {
        }).catch(function(err) {

        });
      } else {
        console.error('User profile does not exist');
      }
    }).catch(function(err) {
      console.error('Failed to get user profile info', err);
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
  },

  setUserProfileDefaults: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      var userProfile = that.userProfile;
      userProfile.goodmoves = userProfile.goodmoves || {};
      userProfile.goodmoves.saved_vacancies = userProfile.goodmoves.saved_vacancies || [];
      if (userProfile === that.userProfile) {
        updateComponents();
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
