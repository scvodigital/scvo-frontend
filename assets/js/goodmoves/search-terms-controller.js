function SearchTermsController() {
  var terms = {};
  var distance = null;
  var center = null;
  var bounds = null;
  var listeners = [];    

  this.addTerm = function(term, value) {
    if (!terms.hasOwnProperty(term)) {
      terms[term] = [];
    }
    
    if (terms[term].indexOf(value) === -1) {
      terms[term].push(value);
    }

    updateTrigger(this.currentState());
  }

  this.removeTerm = function(term, value) {
    if (terms.hasOwnProperty(term)) {
      var index = terms[term].indexOf(value);
      if (index > -1) {
        terms[term].splice(index, 1);
      }
    }
    updateTrigger(this.currentState());
  }

  this.setCenter = function(latitude, longitude, title) {
    bounds = null;
    center = {
      latitude: latitude,
      longitude: longitude,
      title: title
    };
    updateTrigger(this.currentState());
  }

  this.setDistance = function(newDistance) {
    bounds = null;
    distance = newDistance;
    updateTrigger(this.currentState());
  }

  this.setBounds = function(southWest, northEast) {
    center = null;
    distance = null;
    bounds = {
      southWest: {
        latitude: southWest.latitude,
        longitude: southWest.longitude
      },
      northEast: {
        latitude: northEast.latitude,
        longitude: northEast.longitude
      }
    }
    updateTrigger(this.currentState());
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

  this.currentState = function() {
    return {
      terms: terms,
      center: center,
      bounds: bounds,
      distance: distance
    };
  }

  function updateTrigger(state) {
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i](state);
    } 
  }
}
