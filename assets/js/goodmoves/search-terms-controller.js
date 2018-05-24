var SearchTermsController = Class.extend({
  terms: {},
  lat: null,
  lng: null,
  distance: 16093.44,
  location: null,
  keywords: null,
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
    this.lat = latitude || this.lat;
    this.lng = longitude || this.lng;
    this.distance = distance === 'any' ? null : distance || this.distance;
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
    var state = {
      terms: this.terms,
      keywords: this.keywords,
      lat: this.lat,
      lng: this.lng,
      distance: this.distance,
      location: this.location
    };

    return state;
  },

  queryObject: function() {
    var state = {
      keywords: this.keywords,
      lat: this.lat,
      lng: this.lng,
      distance: this.distance,
      location: this.location
    };
    // HACK: Weird hack needed because for some reason this method loses scope
    //       and this.terms starts referring to global terms. This doesn't happen
    //       in currentState(); No idea why.
    var currentState = this.currentState();
    Object.keys(currentState.terms).forEach(function(field) {
      state[field] = currentState.terms[field];
    });

    return state;
  },

  updateTrigger: function() {
    for (var i = 0; i < this.listeners.length; ++i) {
      this.listeners[i](this.currentState());
    }
  }
});
