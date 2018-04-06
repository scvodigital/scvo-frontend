function MapController($map, latitude, longitude, zoomLevel) {
  var listeners = [];
  var map = new google.maps.Map($map[0], {
    center: {
      lat: latitude,
      lng: longitude 
    },
    zoom: zoomLevel
  });
  var pins = [];
  var shapes = [];

  google.maps.event.addListener(map, 'dragend', mapBoundsUpdated.bind(this));
  google.maps.event.addListener(map, 'zoom_change', mapBoundsUpdated.bind(this));

  this.refreshMap = function(shapesOptions, pinsOptions, snapTo = true) {
    clearMap();
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < shapesOptions.length; ++i) {
      var shapeOptions = shapesOptions[i];
      var shapeType = shapeOptions.type || "Circle";
      shapeOptions.map = map;
      var shape = new google.maps[shapeType](shapeOptions);
      shapes.push(shape);
    }

    for (var i = 0; i < pinsOptions.length; ++i) {
      let pinOptions = pinsOptions[i];
      let markerOptions = pinOptions.markerOptions;
      let infoWindowOptions = pinOptions.infoWindowOptions || null;

      markerOptions.map = map;
      let marker = new google.maps.Marker(markerOptions);
      let infoWindow = null;

      if (infoWindowOptions) {
        infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        marker.addListener('click', function() {
          closeInfoWindows();
          infoWindow.open(map, marker);
        });
      }

      let pin = {
        marker: marker,
        infoWindow: infoWindow
      }
      pins.push(pin);

      bounds.extend(markerOptions.position);
    }
    
    if (snapTo) {
      map.fitBounds(bounds); 
    }
  }

  function clearMap() {
    closeInfoWindows();
    for (var i = 0; i < pins.length; ++i) {
      var pin = pins[i];
      pin.marker.setMap(null);
      delete pin;
    }
    pins = [];
    for (var i = 0; i < shapes.length; ++i) {
      var shape = shapes[i];
      shape.setMap(null);
      delete shape;
    }
    shapes = [];    
  }
  
  function closeInfoWindows() {
    for (var i = 0; i < pins.length; ++i) {
      var pin = pins[i];
      if (pin.infoWindow) {
        pin.infoWindow.close();
      } 
    }
  }

  function mapBoundsUpdated() {
    var bounds = map.getBounds();
    updateTrigger(bounds);    
  }

  this.addListener = function(listener) {
    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener);
    }
  }

  this.removeListener = function(listener) {
    var index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }
  
  function updateTrigger(bounds) {
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i](bounds);
    } 
  }
}
