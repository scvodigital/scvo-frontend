var VacanciesController = Class.extend({
  listeners: [],

  doSearch: function(searchTerms) {
    var vacancies = [];
    var body = this.getBody(searchTerms);
    var options = {
      url: '/home-search?' + body,
      type: 'GET',
      contentType: 'application/json; charset=utf-8'
    };
    var _this = this;
    $.ajax(options).done(function(results) {
      if (results.total === 0) {
        vacancies = [];
      } else {
        vacancies = results.hits;
      }
      _this.updateTrigger(vacancies, searchTerms);
    });
  },

  getBody: function(searchTerms) {
    var body = {}

    if (searchTerms.terms) {
      var fields = Object.keys(searchTerms.terms);
      for (var i = 0; i < fields.length; ++i){
        var field = fields[i];
        var terms = searchTerms.terms[field];
        body[fields[i]] = terms;
      }
    }

    if (searchTerms.center) {
      body.lat = searchTerms.center.latitude;
      body.lng = searchTerms.center.longitude;
      body.distance = searchTerms.center.distance || null;
    }

    // console.log('Body:', body);

    return $.param(body);
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

  updateTrigger: function(vacancies, searchTerms) {
    for (var i = 0; i < this.listeners.length; ++i) {
      this.listeners[i](vacancies, searchTerms);
    }
  }
});
