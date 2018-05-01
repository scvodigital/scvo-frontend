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


// Utility functions
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/; secure";
}

// Firebase Auth Functions
app.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('User logged in', user);
    window.uid = user.uid;
    user.getIdToken().then(function(idToken) {
      setCookie('gm_token', idToken, 7);
      getUserProfile(user);
    });
  } else {
    console.log('User logged out');
    delete window.userProfile;
    delete window.uid;
  }
});

function getUserProfile(user) {
  app.database().ref('/users/' + user.uid).once('value').then(function(response) {
    if (response.exists()) {
      window.userProfile = response.val();
      console.log(window.userProfile);
      setUserProfileDefaults().then(function() {
      }).catch(function(err) {

      });
    } else {
      console.error('User profile does not exist');
    }
  }).catch(function(err) {
    console.error('Failed to get user profile info', err);
  });
}

function updateComponents() {
  var userProfile = window.userProfile;
  $('[data-vacancy-id]').removeClass('vacancy-shortlisted');
  if (userProfile.goodmoves && userProfile.goodmoves.saved_vacancies) {
    var savedVacancies = userProfile.goodmoves.saved_vacancies;
    var selectors = savedVacancies.map(function(vid) {
      return '[data-vacancy-id="' + vid + '"]';
    });
    $(selectors.join(',')).addClass('vacancy-shortlisted');
  }
}

function setUserProfileDefaults() {
  return new Promise(function(resolve, reject) {
    var userProfile = window.userProfile;
    userProfile.goodmoves = userProfile.goodmoves || {};
    userProfile.goodmoves.saved_vacancies = userProfile.goodmoves.saved_vacancies || [];
    if (userProfile === window.userProfile) {
      updateComponents();
      resolve();
    } else {
      updateUserProfile(userProfile).then(function(userProfile) {
        console.log('Saved default Goodmoves profile');
        resolve();
      }).catch(function(err) {
        console.error('Error saving default Goodmoves profile', err);
        resolve();
      });
    }
  });
}

function updateUserProfile(userProfile) {
  return new Promise(function(resolve, reject) {
    var path = '/users/' + window.uid;
    app.database().ref(path).update(window.userProfile).then(function() {
      console.log('User profile updated', path);
      window.userProfile = userProfile;
      updateComponents();
      resolve();
    }).catch(function(err) {
      console.error('Failed to update user profile:', path, window.userProfile);
      reject();
    });
  });
}

function toggleShortlistItem(id) {
  var userProfile = window.userProfile;
  var shortlist = userProfile.goodmoves.saved_vacancies;
  var index = shortlist.indexOf(id);
  if (index > -1) {
    shortlist.splice(index, 1);
  } else {
    shortlist.push(id);
  }
  userProfile.goodmoves.saved_vacancies = shortlist;
  updateUserProfile(userProfile).then(function() {
    console.log('Shortlist updated');
  }).catch(function(err) {
    console.error('Failed to update shortlist', err);
  });
}
