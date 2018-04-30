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
    user.getIdToken().then(function(idToken) {
      setCookie('gm_token', idToken, 7);
      getUserProfile(user);
    });
  } else {
    console.log('User logged out');
    delete window.userProfile;
  }
});

function getUserProfile(user) {
  app.database().ref('/users/' + user.uid).once('value').then(function(response) {
    if (response.exists()) {
      var userProfile = response.val();
      window.userProfile = userProfile;
      console.log(userProfile);
      $('[data-vacancy-id]').removeClass('vacancy-saved');
      if (userProfile.goodmoves && userProfile.goodmoves.saved_vacancies) {
        var savedVacancies = userProfile.goodmoves.saved_vacancies;
        var selectors = savedVacancies.map(function(vid) {
          return '[data-vacancy-id="' + vid + '"]';
        });
        $(selectors.join(',')).addClass('vacancy-saved');
      }
    } else {
      console.error('User profile does not exist');
    }
  }).catch(function(err) {
    console.error('Failed to get user profile info', err);
  });
}
