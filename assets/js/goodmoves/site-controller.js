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
  maps: {},
  ie: false,

  init: function(firebaseConfig) {
    this.firebaseConfig = firebaseConfig;
    this.setupComponents();
    this.setupFirebase();

    if (navigator.appName.indexOf('Microsoft') > -1 || navigator.userAgent.indexOf('Trident') > -1) {
      this.ie = true;
    }

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
    this.fie();
  },

  displayModeChanged: function() {
    // console.log('Display Mode:', this.displayMode);
    var that = this;
    $('.mdc-drawer--occasional').each(function(i, o) {
      if (that.displayMode === 'desktop') {
        console.log(that.displayMode, o);
        o.MDCTemporaryDrawer.destroy();
        //$('#sidebar-temporary')
        //  .removeClass('mdc-drawer--temporary')
        //  .addClass('mdc-drawer--permanent');
      } else {
        console.log(that.displayMode, o);
        o.MDCTemporaryDrawer.initialize();
        //$('#sidebar-temporary')
        //  .removeClass('mdc-drawer--permanent')
        //  .addClass('mdc-drawer--temporary');
      }
    });
  },

  fie: function() {
    if (!this.ie) return;
    $('.mdc-drawer--occasional .mdc-drawer__drawer').each(function(i, o) {
      var $o = $(o);
      var parentHeight = $o.parent().height();
      $o.css('height', parentHeight);
    });
  },

  setupComponents: function() {
    var that = this;
    mdc.autoInit();

    // Think we just need the one global snackbar
    var $snackbar = $('#app-snackbar');
    this.snackbar = new mdc.snackbar.MDCSnackbar($snackbar[0]);
    $snackbar.data('defaultCss', {
      'background-color': $snackbar.css('background-color'),
      color: $snackbar.css('color')
    });

    $('[data-ajax-button]').on('click', function(evt) {
      evt.preventDefault();
      var $o = $(event.currentTarget);
      var config = $o.data('ajax-button');

      var request = {
        url: config.url,
        method: ['POST', 'GET', 'PUT', 'DELETE'].indexOf(config.method.toUpperCase()) > -1 ? config.method.toUpperCase() : 'GET',
        dataType: config.responseType || 'html',
        success: function(response, status, xhr) {
          if (config.successMessage) {
            goodmoves.snackbarShow({
              message: config.successMessage
            });
          }
          
          if (config.successCallback) {
            window[config.successCallback].call(this, evt, config, response, status, xhr);
          }
        },
        error: function(xhr, status, err) {
          if (config.failureMessage) {
            goodmoves.snackbarShow({
              message: config.failureMessage,
              backgroundColor: '#dd4b39'
            });
          }

          if (config.failureCallback) {
            window[config.failureCallback].call(this, evt, config, xhr, status, err);
          }
        },
        data: config.postBody
      };

      console.log('REQUEST:', request);
      $.ajax(request);
    });

    // Ajax Forms
    $('form[data-ajax-form]').submit(function(evt) {
      evt.preventDefault();
      var $o = $(event.currentTarget);
      var config = $o.data('ajax-form');
      var url = $o.attr('action');
      var method = $o.attr('method') || 'GET';

      var request = {
        url: url,
        method: ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET',
        dataType: config.responseType || 'html',
        success: function(response, status, xhr) {
          console.log('AJAX Form Success', response, status, xhr, config, config);
          if (config.successMessage) {
            goodmoves.snackbarShow({
              message: config.successMessage
            });
          }
          
          if (config.successCallback) {
            window[config.successCallback].call(this, evt, config, response, status, xhr);
          }
        },
        error: function(xhr, status, err) {
          console.log('AJAX Form Failure', xhr, status, err);
          if (config.failureMessage) {
            goodmoves.snackbarShow({
              message: config.failureMessage,
              backgroundColor: '#dd4b39'
            });
          }

          if (config.failureCallback) {
            window[config.failureCallback].call(this, evt, config, xhr, status, err);
          }
        }
      };

      if (method.toUpperCase() === 'GET') {
        request.url += (request.url.indexOf('?') > -1 ? '&' : '') + $o.serialize();
      } else {
        var data = {};
        var params = $o.serializeArray();
        console.log('PARAMS:', params);
        for (var p = 0; p < params.length; p++) {
          var param = params[p];
          if (!data.hasOwnProperty(param.name)) {
            data[param.name] = param.value;
          } else {
            if (!$.isArray(data[param.name])) {
              data[param.name] = [data[param.name]];
            }
            data[param.name].push(param.value);
          }
        }
        request.data = data;
      }
      console.log('REQUEST:', request);
      $.ajax(request);
    });

    $('[data-mdc-auto-init="MDCTextField"][novalidate]').each(function(i, o) {
      var foundation = o.MDCTextField.foundation_;
      foundation.useCustomValidityChecking = true;
      $(o).find('input').on('blur', function() {
        o.MDCTextField.valid = true;
      });
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
      // var $caption = $el.find('.mdc-typography--caption');
      var $icon = $el.find('.far');
      if ($target.is(':visible')) {
        $target.hide();
        // $caption.show();
        $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
      } else {
        $target.show();
        // $caption.hide();
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
              // $chip.find('.mdc-chip__icon--leading')[selected ? 'removeClass' : 'addClass']('mdc-chip__icon--leading-hidden');
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

    $('[data-map-options]').each(function(i, o) {
      var options = $(o).data('map-options');
      var initialLat = 55.94528820000001;
      var initialLng = -3.200755699999945;
      var initialZoom = 9;
      if (options.center) {
        var initialLat = options.center.lat;
        var initialLng = options.center.lng;
        var initialZoom = options.zoom;
      }
      var map = L.map(o, {
        fullscreenControl: true,
        scrollWheelZoom: false,
        trackResize: false
      }).setView([initialLat, initialLng], initialZoom);
      var osmAttrib = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
      L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
        attribution: osmAttrib,
        minZoom: 6,
        maxZoom: 18,
        opacity: 0.8
      }).addTo(map);
      L.control.scale().addTo(map);
      var mapName = $(o).data('map-name');

      // console.log(options.circle);
      var searchArea;
      var searchAreaShown = false;
      if (options.circle) {
        if (options.circle.radius > 0) {
          searchArea = L.circle(
            [options.circle.lat, options.circle.lng],
            {
              radius: options.circle.radius*1000,
              color: '#9cd986',
              fillColor: '#9cd986',
              fillOpacity: 0.1
            }
          ).addTo(map);
          searchAreaShown = true;
        }
      }

      var $vacancies = $('marker[data-map="' + mapName + '"]');
      var vacancyMarkers = {};

      $vacancies.each(function(i, o) {
        var $o = $(o);
        var key = $o.data('lat') + ',' + $o.data('lng');
        if (!vacancyMarkers.hasOwnProperty(key)) {
          vacancyMarkers[key] = {
            position: {
              lat: $o.data('lat'),
              lng: $o.data('lng')
            },
            shortlisted: $o.data('shortlisted'),
            homebased: $o.data('homebased'),
            contents: []
          };
        }
        vacancyMarkers[key].contents.push($o.html());
      });

      var markers = new L.featureGroup();
      var vacancyPositions = Object.keys(vacancyMarkers);

      for (var p = 0; p < vacancyPositions.length; p++) {
        var vacancyPosition = vacancyPositions[p];
        var vacancyMarker = vacancyMarkers[vacancyPosition];
        var iconType = '';
        if (vacancyMarker.homebased) {
          iconType = ' homebased';
        }
        if (vacancyMarker.shortlisted) {
          iconType = ' shortlisted';
        }
        var icon = L.divIcon({
          html: '<i class="marker-icon fas fa-map-marker' + iconType + '"></i><span class="map-marker-overlay' + iconType + '">' + vacancyMarker.contents.length  + '</span>',
          iconSize: [30, 40],
          iconAnchor: [15, 40],
          popupAnchor: [0, -42],
          className: 'vacancy_icon'
        });
        var marker = L.marker([vacancyMarker.position.lat, vacancyMarker.position.lng], {icon: icon}).addTo(map);
        var html;
        if (vacancyMarker.contents.length > 1) {
          var id = 'popup-pager-' + p;
          var content = $('<div>');
          var pager = $('<div>')
          .attr('id', id)
          .addClass('popup-pager')
          .append(vacancyMarker.contents.join('\n'))
          .appendTo(content);
          var back = $('<a>')
          .attr('href', 'javascript:goodmoves.popupPagerPage("#' + id + '", "back")')
          .addClass('scroll-button pager pager-left')
          .append('<span class="fas fa-fw fa-angle-left fa-2x"></span>')
          .appendTo(content);
          var next = $('<a>')
          .attr('href', 'javascript:goodmoves.popupPagerPage("#' + id + '", "next")')
          .addClass('scroll-button pager pager-right')
          .append('<span class="fas fa-fw fa-angle-right fa-2x"></span>')
          .appendTo(content);
          back.on('click', function(evt) {
            var pager = $(evt.currentTarget).parent();
            popupPage(pager, 'back');
          });
          next.on('click', function(evt) {
            var pager = $(evt.currentTarget).parent();
            popupPage(pager, 'next');
          });
          html = content.html();
        } else {
          html = vacancyMarker.contents[0];
        }
        marker.bindPopup(html);
        markers.addLayer(marker);
      }

      if (!options.center) {
        if (searchAreaShown) {
          map.fitBounds(searchArea.getBounds());
        } else {
          map.fitBounds(markers.getBounds());
        }
      }

      that.maps[mapName] = map;
    });

    $('textarea[data-autosize]').each(function() {
      var offset = this.offsetHeight - this.clientHeight;

      var resizeTextarea = function(el) {
        var $el = $(el);
        if ($el.is(':visible')) {
          $el.css('height', 'auto').css('height', Math.max(el.scrollHeight, offset));
        } else {
          var hiddenParent = $el;
          while (hiddenParent.parent()[0] && !hiddenParent.parent().is(':visible')) {
            hiddenParent = hiddenParent.parent();
          }
          var state = hiddenParent.attr('style') || '';
          hiddenParent.css({ 'visibility': 'hidden', 'display': 'block' });
          $el.css('height', 'auto').css('height', Math.max(el.scrollHeight, offset));
          hiddenParent.attr('style', state);
        }
      };
      $(this).on('keyup input', function() { resizeTextarea(this); });
      resizeTextarea(this);
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
  },

  popupPagerPage: function(pager, direction) {
    var currentPage = $(pager).find('.map-content:visible');
    var nextPage = currentPage;
    if (direction === 'next') {
      var nextElement = currentPage.next();
      if (!nextElement || nextElement.length === 0) {
        nextPage = $(pager).children().first();
      } else {
        nextPage = nextElement;
      }
    } else if (direction === 'back') {
      var prevElement = currentPage.prev();
      if (!prevElement || prevElement.length === 0) {
        nextPage = $(pager).children().last();
      } else {
        nextPage = prevElement;
      }
    }
    currentPage.hide();
    nextPage.show();
  }
});

var goodmoves = null;
$(document).ready(function() {
  goodmoves = new GoodmovesController({
    apiKey: "AIzaSyAuGAacoIdUgbtfI42UXTHDosMS4pP5Teg",
    authDomain: "goodmoves-frontend.firebaseapp.com",
    databaseURL: "https://goodmoves-frontend.firebaseio.com",
    projectId: "goodmoves-frontend",
    storageBucket: "goodmoves-frontend.appspot.com",
    messagingSenderId: "639831727728"
  });
});

function initMap() {
  handleLocationBoxes();
}

function handleLocationBoxes() {
  $('[data-location-options]').each(function(i, o) {
    var options = $(o).data('location-options');
    var latSelector = $(o).data('location-lat');
    var lngSelector = $(o).data('location-lng');
    var lsSelector = $(o).data('location-services');

    var autocomplete = new google.maps.places.Autocomplete(o, options);
    autocomplete.addListener('place_changed', function(evt) {
      var place = this.getPlace();
      if (place.geometry.location) {
        $(o).val(place.formatted_address);
        $(latSelector).val(place.geometry.location.lat());
        $(lngSelector).val(place.geometry.location.lng());
      }
    });

    $(o).on('focus', function(evt) {
      if ($(latSelector).val() !== '') {
        $(o).val('');
        $(latSelector).val('');
        $(lngSelector).val('');
      }
    }).on('blur', function(evt) {
      if ($(latSelector).val() === '') {
        $(o).val('');
      }
    });

    $(lsSelector).on('click', function(evt) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;

          $(latSelector).val(lat);
          $(lngSelector).val(lng);

          var base = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
          var coords = lat + ',' + lng;
          var key = 'AIzaSyCT7vZkJdto5JoAUDx3asuHu7mHcl8UanQ';
          var url = base + coords + '&key=' + key + '&result_type=locality';
          $.getJSON(url, function(place) {
            if (place.results && place.results.length > 0) {
              var locality = place.results[0].address_components[0].short_name;
            }
            if (locality) {
              $(o).val(locality);
            } else {
              $(o).val(lat + ', ' + lng);
              goodmoves.snackbarShow({
                message: 'Could not find a name for your location'
              });
            }
          });
        });
      }
    });
  }).on('keypress', function(evt) {
    if (evt.which === 13) {
      evt.preventDefault();
      return false;
    }
  });
}

// function handleLocationBoxes() {
//   window.autocompletes = {};
//   $('[data-location-options]').each(function(i, o) {
//     var $o = $(o);
//     var id = $o.attr('id');
//     var options = $o.data('location-options');
//
//     var autocomplete = new google.maps.places.Autocomplete(o, options);
//     autocomplete.addListener('place_changed', function(evt) {
//       setPlace($o);
//     });
//
//     window.autocompletes[id] = autocomplete;
//
//     $('select[data-location="' + id + '"]').on('change', function(evt) {
//       var $distance = $(evt.currentTarget);
//       var $innerNe = $('input[data-location-inner-ne="' + id + '"]');
//       var $innerSw = $('input[data-location-inner-sw="' + id + '"]');
//       var $outerNe = $('input[data-location-outer-ne="' + id + '"]');
//       var $outerSw = $('input[data-location-outer-sw="' + id + '"]');
//       if (!$innerNe.val() || !$innerSw.val()) return;
//
//       var innerNe = $innerNe.val().split(', ');
//       var innerSw = $innerSw.val().split(', ');
//       var distance = $distance.val();
//       var outer = extendBounds(innerNe[0], innerNe[1], innerSw[0], innerSw[1], distance);
//       var outerNorthEast = outer.getNorthEast();
//       var outerSouthWest = outer.getSouthWest();
//
//       $outerNe.val(outerNorthEast.lat() + ', ' + outerNorthEast.lng());
//       $outerSw.val(outerSouthWest.lat() + ', ' + outerSouthWest.lng());
//     });
//   }).on('keypress', function(evt) {
//     if (evt.which === 13) {
//       evt.preventDefault();
//       return false;
//     }
//   }).on('blur', function(evt) {
//     setPlace(evt.currentTarget);
//   });
// }

// var innerSquare = null;
// var outerSquare = null;
//
// function setPlace(field) {
//   var $o = $(field);
//   var id = $o.attr('id');
//   var $innerNe = $('input[data-location-inner-ne="' + id + '"]');
//   var $innerSw = $('input[data-location-inner-sw="' + id + '"]');
//   var $outerNe = $('input[data-location-outer-ne="' + id + '"]');
//   var $outerSw = $('input[data-location-outer-sw="' + id + '"]');
//   var $distance = $('select[data-location="' + id + '"]');
//   var autocomplete = window.autocompletes[$o.attr('id')];
//
//   if (autocomplete) {
//     var place = autocomplete.getPlace();
//     if (place && place.geometry && place.geometry.location) {
//       var inner = place.geometry.viewport;
//       var innerNorthEast = inner.getNorthEast();
//       var innerSouthWest = inner.getSouthWest();
//       var distance = $distance.val();
//
//       $innerNe.val(innerNorthEast.lat() + ', ' + innerNorthEast.lng());
//       $innerSw.val(innerSouthWest.lat() + ', ' + innerSouthWest.lng());
//
//       var outer = extendBounds(innerNorthEast.lat(), innerNorthEast.lng(), innerSouthWest.lat(), innerSouthWest.lng(), distance);
//       var outerNorthEast = outer.getNorthEast();
//       var outerSouthWest = outer.getSouthWest();
//
//       $outerNe.val(outerNorthEast.lat() + ', ' + outerNorthEast.lng());
//       $outerSw.val(outerSouthWest.lat() + ', ' + outerSouthWest.lng());
//
//       $o.val(place.formatted_address);
//     } else {
//       $o.val('');
//       $innerNe.val('');
//       $innerSw.val('');
//       $outerNe.val('');
//       $outerSw.val('');
//     }
//   }
// }

// // returns latlng of new coordinate which is dist from the longitude given
// function lngDistance(lat1, lng1, dist) {
//     var R = 6371000; // m
//     lat1 = deg2rad(lat1);
//     lng1 = deg2rad(lng1);
//     var lng2 = (R*lng1*Math.cos(lat1)-dist)/(R*Math.cos(lat1));
//     return(rad2lng(lng2));
// }
//
// // returns latlng of new coordinate which is dist from the latitude given
// function latDistance(lat1, dist) {
//     var R = 6371000; // m
//     var lat1 = deg2rad(lat1);
//     var lat2 = (R*lat1-dist)/R;
//     return(rad2lat(lat2));
// }
//
// function extendBounds(latNE, lngNE, latSW, lngSW, dist) {
//     var latlngNE = new google.maps.LatLng(latDistance(latNE, -dist), lngDistance(latNE,lngNE, -dist));
//     var latlngSW = new google.maps.LatLng(latDistance(latSW, dist), lngDistance(latSW, lngSW, dist));
//     return (new google.maps.LatLngBounds(latlngSW, latlngNE));
// }
//
// function deg2rad(deg) {
//   return deg * .017453292519943295
// }
//
// // convert radians into latitude
// // 90 to -90
// function rad2lat(rad) {
//     // first of all get everthing into the range -2pi to 2pi
//     rad = rad % (Math.PI*2);
//
//     // convert negatives to equivalent positive angle
//     if (rad < 0)
//         rad = 2*Math.PI + rad;
//
//     // restict to 0 - 180
//     var rad180 = rad % (Math.PI);
//
//     // anything above 90 is subtracted from 180
//     if (rad180 > Math.PI/2)
//         rad180 = Math.PI - rad180;
//     // if it is greater than 180 then make negative
//     if (rad > Math.PI)
//         rad = -rad180;
//     else
//         rad = rad180;
//
//     return(rad/Math.PI*180);
// }
//
// // convert radians into longitude
// // 180 to -180
// function rad2lng(rad) {
//     // first of all get everthing into the range -2pi to 2pi
//     rad = rad % (Math.PI*2);
//     if (rad < 0)
//         rad = 2*Math.PI + rad;
//
//     // convert negatives to equivalent positive angle
//     var rad360 = rad % (Math.PI*2);
//
//     // anything above 90 is subtracted from 360
//     if (rad360 > Math.PI)
//         rad360 = Math.PI*2 - rad360;
//
//     // if it is greater than 180 then make negative
//     if (rad > Math.PI)
//         rad = -rad360;
//     else
//         rad = rad360;
//
//     return(rad/Math.PI*180);
// }
