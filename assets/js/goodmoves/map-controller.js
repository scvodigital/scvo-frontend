var MapController = Class.extend({
  listeners: [],
  pins: [],
  shapes: [],
  initialCoods: null,
  initialZoom: 6,

  init: function($map, latitude, longitude, zoomLevel) {
    this.initialCoords = {
      lat: latitude,
      lng: longitude
    };
    this.initialZoom = zoomLevel;
    this.map = new google.maps.Map($map[0], {
      center: this.initialCoords,
      zoom: this.initialZoom,
      disableDefaultUI: true
    });
  },

  refreshMap: function(shapesOptions, pinsOptions, snapTo = true) {
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

    for (var i = 0; i < pinsOptions.length; ++i) {
      let pinOptions = pinsOptions[i];
      let markerOptions = pinOptions.markerOptions;
      let infoWindowOptions = pinOptions.infoWindowOptions || null;

      markerOptions.map = this.map;
      let marker = new google.maps.Marker(markerOptions);
      let infoWindow = null;

      if (infoWindowOptions) {
        infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        marker.addListener('click', function() {
          this.closeInfoWindows();
          infoWindow.open(this.map, marker);
        }.bind(this));
      }

      let pin = {
        marker: marker,
        infoWindow: infoWindow
      }
      this.pins.push(pin);

      pinBounds.extend(markerOptions.position);
    }
    
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
