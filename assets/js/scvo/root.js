document.addEventListener('DOMContentLoaded', function() {
    // Material Design Components
    //mdc.autoInit();

    //google.maps.event.addDomListener(window, 'load', initMap);

    // Resize iframes
    window.addEventListener("message", function (event) {
        if (event.data.hasOwnProperty('event')) {
            console.log(event);
            switch (event.data.event) {
                case ('resize'):
                    document.querySelector('iframe[src*="' + event.origin + '"]').style.height = (40+event.data.height) + 'px';
                    window.scrollTo(0, 0);
                    break;
            }
        }
    });

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

    // document.onreadystatechange = function(e) {
    //     if (document.readyState === 'complete') {
    //         document.getElementById("spinner").style.display = "none";
    //     }
    // };
    // window.onload = function () {
    //     document.getElementById("spinner").style.display = "none";
    // }

    // Mobile menu
    // window.drawerEl = document.querySelector('.mdc-temporary-drawer');
    // window.drawer = mdc.drawer.MDCTemporaryDrawer.attachTo(drawerEl);
    // document.querySelector('#menu_button').addEventListener('click', function() {
    //     window.drawer.open = true;
    // });
    // drawerEl.addEventListener('MDCTemporaryDrawer:open', function() {
    //     // console.log('Received MDCTemporaryDrawer:open');
    // });
    // drawerEl.addEventListener('MDCTemporaryDrawer:close', function() {
    //     // console.log('Received MDCTemporaryDrawer:close');
    // });

    // Headroom

    // Share widget
    window.share = function(where) {
        var ogTitleEl = document.head.querySelector('meta[property="og:title"]');
        var ogDescriptionEl = document.head.querySelector('meta[property="og:description"]');
        var pageTitle = ogTitleEl ? ogTitleEl.content : document.title;
        var pageDescription = ogDescriptionEl ? ogDescriptionEl.content : '';
        var pageUrl = window.location.href;
        var shareUrl, shareHeight, shareWidth;
        switch (where) {
            case ('facebook'):
                shareHeight = 420;
                shareWidth = 550;
                shareUrl = 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(pageUrl);
                break;
            case ('twitter'):
                shareHeight = 420;
                shareWidth = 550;
                shareUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(pageTitle) + '&via=scvotweet&url=' + encodeURIComponent(pageUrl);
                break;
            default: return;
        }
        var shareWindow = window.open(shareUrl, 'share-window', 'height=' + shareHeight + ',width=' + shareWidth + ',location=0,menubar=0,status=0,resizable=0,toolbar=0');
    }

    // Auto-search
    window.setupAutoSearchForms = function() {
        var autoSearchForms = document.querySelectorAll('form[data-auto-search="true"]');
        for (var x = 0; x < autoSearchForms.length; x++) {
            var searchForm = autoSearchForms[x];
            var submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'submit');
            submitButton.setAttribute('style', 'display:none');
            searchForm.appendChild(submitButton);
            var changeTriggers = searchForm.querySelectorAll('select,input[type="checkbox"],input[type="radio"]');
            for (var y = 0; y < changeTriggers.length; y++) {
                changeTriggers[y].addEventListener('change', function() {
                    submitButton.click();
                });
            }
        }
    }
    window.setupAutoSearchForms();

    var cjsConfig = {
      apiKey: "AIzaSyBi394RRo4NADgb_slJOYgzOugxXQPjKT8",
      authDomain: "scvo-auth-cjs.firebaseapp.com",
      databaseURL: "https://scvo-auth-cjs.firebaseio.com",
      projectId: "scvo-auth-cjs",
      storageBucket: "scvo-auth-cjs.appspot.com",
      messagingSenderId: "550823198000"
    };
    cjsFirebase = firebase.initializeApp(cjsConfig, 'cjs');
});
var cjsFirebase;
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/; secure";
}

