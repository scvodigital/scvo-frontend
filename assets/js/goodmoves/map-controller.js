var MapController = Class.extend({
  listeners: [],
  pins: [],
  shapes: [],
  initialCoods: null,
  initialZoom: 6,

  init: function($map, latitude, longitude, zoomLevel) {
    this.initialCoords = {
      'lat': latitude,
      'lng': longitude
    };
    this.initialZoom = zoomLevel;
    this.map = new google.maps.Map($map[0], {
      'center': this.initialCoords,
      'zoom': this.initialZoom,
      'styles': [
        {
          'featureType': 'administrative.country',
          'elementType': 'labels',
          'stylers': [
            { 'visibility': 'off' }
          ]
        },
        {
          'featureType': 'poi',
          'elementType': 'labels',
          'stylers': [
            { 'visibility': 'off' }
          ]
        },
        {'elementType': 'geometry', 'stylers': [{'color': '#d1edc4'}]},
        {'elementType': 'labels.text.stroke', 'stylers': [{'color': '#ffffff'}]},
        {'elementType': 'labels.text.fill', 'stylers': [{'color': '#424242'}]},
        {
          'featureType': 'administrative.locality',
          'elementType': 'labels.text.fill',
          'stylers': [{'color': '#424242'}]
        },
        {
          'featureType': 'road',
          'elementType': 'geometry',
          'stylers': [{'color': '#888888'}]
        },
        {
          'featureType': 'road',
          'elementType': 'geometry.stroke',
          'stylers': [{'color': '#d1edc4'}]
        },
        {
          'featureType': 'road',
          'elementType': 'labels.text.fill',
          'stylers': [{'color': '#424242'}]
        },
        {
          'featureType': 'road.highway',
          'elementType': 'geometry',
          'stylers': [{'color': '#888888'}]
        },
        {
          'featureType': 'road.highway',
          'elementType': 'geometry.stroke',
          'stylers': [{'color': '#d1edc4'}]
        },
        {
          'featureType': 'road.highway',
          'elementType': 'labels.text.fill',
          'stylers': [{'color': '#424242'}]
        },
        {
          'featureType': 'transit',
          'elementType': 'geometry',
          'stylers': [{'color': '#111111'}]
        },
        {
          'featureType': 'transit.line',
          'elementType': 'geometry',
          'stylers': [{'color': '#111111'}]
        },
        {
          'featureType': 'transit.line',
          'elementType': 'geometry.stroke',
          'stylers': [{'color': '#111111'}]
        },
        {
          'featureType': 'transit.station',
          'elementType': 'labels.text.fill',
          'stylers': [{'color': '#424242'}]
        },
        {
          'featureType': 'transit.station.airport',
          'elementType': 'geometry',
          'stylers': [{'color': '#888888'}]
        },
        {
          'featureType': 'transit.station.bus',
          'elementType': 'geometry',
          'stylers': [{'color': '#333333'}]
        },
        {
          'featureType': 'transit.station.rail',
          'elementType': 'geometry',
          'stylers': [{'color': '#333333'}]
        },
        {
          'featureType': 'water',
          'elementType': 'geometry',
          'stylers': [{'color': '#c4deed'}]
        },
        {
          'featureType': 'water',
          'elementType': 'labels.text.fill',
          'stylers': [{'color': '#424242'}]
        },
        {
          'featureType': 'water',
          'elementType': 'labels.text.stroke',
          'stylers': [{'color': '#424242'}]
        }
      ],
      'disableDefaultUI': true
    });
  },

  refreshMap: function(shapesOptions, pinsOptions, snapTo) {
    snapTo = typeof snapTo === 'undefined' ? true : snapTo;
    this.clearMap();
    var pinBounds = new google.maps.LatLngBounds();
    var shapeBounds = new google.maps.LatLngBounds();

    for (var i = 0; i < shapesOptions.length; ++i) {
      var shapeOptions = shapesOptions[i];
      var shapeType = shapeOptions.type || "Circle";
      shapeOptions.map = this.map;
      var shape = new google.maps[shapeType](shapeOptions);
      this.shapes.push(shape);

      var bounds = shape.getBounds();
      shapeBounds.extend(bounds.getNorthEast());
      shapeBounds.extend(bounds.getSouthWest());
    }

    var that = this;
    pinsOptions.forEach(function(pinOptions) {
      var markerOptions = pinOptions.markerOptions;
      var infoWindowOptions = pinOptions.infoWindowOptions || null;

      markerOptions.map = that.map;
      var marker = new google.maps.Marker(markerOptions);
      var infoWindow = null;

      if (infoWindowOptions) {
        infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        marker.addListener('click', function() {
          that.closeInfoWindows();
          infoWindow.open(that.map, marker);
        }.bind(that));
      }

      var pin = {
        marker: marker,
        infoWindow: infoWindow
      }
      that.pins.push(pin);

      pinBounds.extend(markerOptions.position);
    });

    if (snapTo && pinsOptions.length > 0) {
      this.map.fitBounds(pinBounds);
      var zoom = this.map.getZoom();
      if (zoom > 12) {
        this.map.setZoom(12);
      } else if (zoom < 6) {
        this.map.setZoom(6);
      }
    } else if (snapTo && pinsOptions.length === 0) {
      if (shapesOptions.length > 0) {
        this.map.fitBounds(shapeBounds);
      } else {
        this.map.setCenter(this.initialCoords);
        this.map.setZoom(this.initialZoom);
      }
    }
  },

  clearMap: function() {
    this.closeInfoWindows();
    for (var i = 0; i < this.pins.length; ++i) {
      var pin = this.pins[i];
      pin.marker.setMap(null);
      delete pin;
    }
    this.pins = [];
    for (var i = 0; i < this.shapes.length; ++i) {
      var shape = this.shapes[i];
      shape.setMap(null);
      delete shape;
    }
    this.shapes = [];
  },

  closeInfoWindows: function() {
    for (var i = 0; i < this.pins.length; ++i) {
      var pin = this.pins[i];
      if (pin.infoWindow) {
        pin.infoWindow.close();
      }
    }
  }
});
