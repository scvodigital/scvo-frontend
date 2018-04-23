var SearchTermsController = Class.extend({
  terms: {},
  center: {
    latitude: null,
    longitude: null,
    distance: 16093.44
  },
  listeners: [],

  init: function() {
    console.log('Search Terms Controller Init');
  },

  addTerm: function(term, value) {
    if (!this.terms.hasOwnProperty(term)) {
      this.terms[term] = [];
    }
    
    if (this.terms[term].indexOf(value) === -1) {
      this.terms[term].push(value);
    }

    this.updateTrigger();
  },

  removeTerm: function(term, value) {
    if (this.terms.hasOwnProperty(term)) {
      var index = this.terms[term].indexOf(value);
      if (index > -1) {
        this.terms[term].splice(index, 1);
      }
      if (this.terms[term].length === 0){
        delete this.terms[term];
      }
    }
    this.updateTrigger();
  },

  setCenter: function(latitude, longitude, distance) {
    this.center = {
      latitude: latitude || this.center.latitude,
      longitude: longitude || this.center.longitude,
      distance: distance === 'any' ? null : distance || this.center.distance
    };
    this.updateTrigger();
  },

  addListener: function(listener) {
    if (this.listeners.indexOf(listener) === -1) {
      this.listeners.push(listener);
    }
  },

  removeListener: function(listener) {
    var index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  },

  currentState: function() {
    return {
      terms: this.terms,
      center: (this.center.latitude) ? this.center : null
    };
  },

  updateTrigger: function() {
    for (var i = 0; i < this.listeners.length; ++i) {
      this.listeners[i](this.currentState());
    } 
  }
});
