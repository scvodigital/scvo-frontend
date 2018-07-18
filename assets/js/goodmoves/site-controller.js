var GoodmovesController = Class.extend({
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

    var mapName = $(o).data('map-name');
    var $markers = $('marker[data-map="' + mapName + '"]');
    var pinBounds = new google.maps.LatLngBounds();
    var markers = [];

    $markers.each(function(i, o) {
      var $marker = $(o);
      var markerOptions = {
        map: map,
        position: {
          lat: $marker.data('lat'),
          lng: $marker.data('lng')
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
        title: $marker.data('title'),
        opacity: 1
      };
      var infoWindowOptions = {
        content: $marker.html()
      };

      var marker = new google.maps.Marker(markerOptions);
      var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
      marker.addListener('click', function() {
        markers.forEach(function(marker) {
          marker.infoWindow.close();
        });
        infoWindow.open(map, marker);
      });

      markers.push({
        marker: marker,
        infoWindow: infoWindow
      });
      pinBounds.extend(markerOptions.position);
    });
    map.fitBounds(pinBounds);
  });
}
