function VacanciesController(getBody) {
  var listeners = [];

  this.doSearch = function(searchTerms) {
    var vacancies = [];
    var body = getBody(searchTerms);
    var options = {
      url: '/home-search',
      type: 'POST',
      data: JSON.stringify(body),
      contentType: 'application/json; charset=utf-8'
    };
    $.ajax(options).done(function(results) {
      if (results.hits.total === 0) {
        vacancies = [];
      } else { 
        var hits = results.hits.hits;
        vacancies = hits.map(hit => hit._source);
      }
      updateTrigger(vacancies, searchTerms);
    });
  }

  function getBody(searchTerms) {
    var body = {}

    var fields = Object.keys(searchTerms.terms);
    for (var i = 0; i < fields.length; ++i){
      var field = fields[i];
      var terms = searchTerms.terms[field];
      body[fields[i]] = terms;
    }

    if (searchTerms.center) {
      body.lat = searchTerms.center.latitude;
      body.lng = searchTerms.center.longitude;
      body.distance = searchTerms.center.distance || null;
    }

    console.log('Body:', body);

    return body;
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
  
  function updateTrigger(vacancies, searchTerms) {
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i](vacancies, searchTerms);
    } 
  }
}
