var GoodmovesController = Class.extend({
  app: null,
  config: null,
  displayMode: null,
  displayModes: [
    { name: 'mobile', min: 0, max: 599 },
    { name: 'tablet', min: 600, max: 959 },
    { name: 'desktop', min: 960, max: 20000 }
  ],
  snackbar: null,

  init: function(firebaseConfig) {
    this.firebaseConfig = firebaseConfig;
    this.setupMaterialDesignComponents();
    this.setupFirebase();

    var that = this;
    $(window).on('resize', function() {
      that.windowResized.call(that);
    });
    this.windowResized();

    // Headroom
    var header = document.querySelector("header.top-bar-stuck");
    var headroom  = new Headroom(header, {
        "offset": 138,
        "tolerance": 5
    });
    headroom.init();
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
    // console.log('Display Mode:', this.displayMode);
    if (this.displayMode === 'desktop') {
      //$('#sidebar-temporary')
      //  .removeClass('mdc-drawer--temporary')
      //  .addClass('mdc-drawer--permanent');
    } else {
      //$('#sidebar-temporary')
      //  .removeClass('mdc-drawer--permanent')
      //  .addClass('mdc-drawer--temporary');
    }
  },

  setupMaterialDesignComponents: function() {
    mdc.autoInit();

    // Think we just need the one global snackbar
    var $snackbar = $('#app-snackbar');
    this.snackbar = new mdc.snackbar.MDCSnackbar($snackbar[0]);
    $snackbar.data('defaultCss', {
      'background-color': $snackbar.css('background-color'),
      color: $snackbar.css('color')
    });

    // Menu buttons
    $('[data-menu-target]').each(function(i, o) {
      var selector = $(o).attr('data-menu-target');
      var menuEl = $(selector)[0];
      $(o).on('click', function() {
        menuEl.MDCMenu.open = !menuEl.MDCMenu.open;
      });
    });

    // Dialog activator buttons
    $('[data-dialog-target]').each(function(i, o) {
      var selector = $(o).attr('data-dialog-target');
      var dialogEl = $(selector)[0];
      $(o).on('click', function() {
        dialogEl.MDCDialog.show();
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

    // Collapsibles
    $('[data-collapse-target]').off('click').on('click', function(evt) {
      // console.log('Collapse click:', evt);
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

    // Ajax Chips
    $('[data-ajax-chip]').each(function(i, o) {
      var $chip = $(o);
      var options = $chip.data('ajax-chip');
      var chip = new mdc.chips.MDCChip(o);

      options.onUrl = options.onUrl || options.toggleUrl;
      options.offUrl = options.offUrl || options.onUrl;
      options.onData = options.onData || options.toggleData || null;
      options.offData = options.offData || options.onData;
      options.onMethod = options.onMethod || options.toggleMethod || 'GET';
      options.offMethod = options.offMethod || options.onMethod;

      $chip.on('click', function() {
        if (!$chip.data('disabled')) {
          $chip.data('disabled', true);
          $chip.css('opacity', 0.5);
          var selected = $chip.hasClass('mdc-chip--selected');
          var ajax = {
            url: selected ? options.offUrl || options.onUrl : options.onUrl,
            method: selected ? options.offMethod || options.onMethod : options.onMethod,
            data: selected ? options.offData || options.onData || null : options.onData || null,
            dataType: 'html',
            success: function() {
              if (options.onClasses) {
                var selectors = Object.keys(options.onClasses);
                for (var s = 0; s < selectors.length; ++s) {
                  var selector = selectors[s];
                  var cssClass = options.onClasses[selector];
                  $(selector)[selected ? 'removeClass' : 'addClass'](cssClass);
                }
              }
              if (options.offClasses) {
                var selectors = Object.keys(options.offClasses);
                for (var s = 0; s < selectors.length; ++s) {
                  var selector = selectors[s];
                  var cssClass = options.offClasses[selector];
                  $(selector)[!selected ? 'removeClass' : 'addClass'](cssClass);
                }
              }
              $chip.find('.mdc-chip__text').text(!selected ? options.onText : options.offText);
              chip.foundation.setSelected(!selected);
              $chip.data('disabled', false);
              $chip.css('opacity', 1);
            },
            error: function() {
              console.error('Failed toggle', options, arguments);
              $chip.data('disabled', false);
              $chip.css('opacity', 1);
            }
          };
          $.ajax(ajax);
        }
      });
    });
  },

  setupFirebase: function() {
    // Initialize Firebase
    this.app = firebase.initializeApp(this.firebaseConfig);
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

  disable: function(elements, disable) {
    disable = typeof disable === 'undefined' ? true : disable;
    for (var e = 0; e < elements.length; ++e) {
      var element = elements[e];
      var opacity = disable ? 0.5 : 1;
      $(element).prop('disabled', disable).css('opacity', opacity);
    }
  },

  snackbarShow: function(options) {
    var $snackbar = $('#app-snackbar');
    $snackbar.css($snackbar.data('defaultCss'));

    if (options.backgroundColor) {
      $snackbar.css('background-color', options.backgroundColor);
      delete options.backgroundColor;
    }
    if (options.color) {
      $snackbar.css('color', options.color);
      delete options.color;
    }
    this.snackbar.show(options);
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
    // var typesSelector = $(o).data('location-types');

    var autocomplete = new google.maps.places.Autocomplete(o, options);
    autocomplete.addListener('place_changed', function(evt) {
      var place = this.getPlace();
      // console.log(place.formatted_address);
      // console.log(place);
      if (place.geometry.location) {
        $(latSelector).val(place.geometry.location.lat());
        $(lngSelector).val(place.geometry.location.lng());
        // $(typesSelector).val(place.types);
        $(o).val(place.formatted_address);
      }
    });
  });
}

function handleMaps() {
  window.maps = {};

  var maps = $('[data-map-options]').each(function(i, o) {
    var options = $(o).data('map-options');
    var map = L.map(o, {
      scrollWheelZoom: false,
      fullscreenControl: {
        pseudoFullscreen: false // if true, fullscreen to page width and height
      },
    }).setView([51.505, -0.09], 13);
    var osmAttrib = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
    L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
        attribution: osmAttrib,
        minZoom: 6,
        maxZoom: 15,
        opacity: 0.8,
        scrollWheelZoom: false
    }).addTo(map);
    var mapName = $(o).data('map-name');
    var $markers = $('marker[data-map="' + mapName + '"]');
    var markers = new L.featureGroup();

    $markers.each(function(i, o) {
      var $marker = $(o);
      var lat = $marker.data('lat');
      var lng = $marker.data('lng');
      var marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup($marker.html());
      markers.addLayer(marker);
    });

    map.fitBounds(markers.getBounds());

    window.maps[mapName] = map;
  });
}
