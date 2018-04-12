function SearchTermsController() {
  var terms = {};
  var center = {
    latitude: null,
    longitude: null,
    distance: 16093.44
  };
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

  this.setCenter = function(latitude, longitude, distance) {
    center = {
      latitude: latitude || center.latitude,
      longitude: longitude || center.longitude,
      distance: distance || center.distance
    };
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
      center: (center.latitude) ? center : null
    };
  }

  function updateTrigger(state) {
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i](state);
    } 
  }
}
