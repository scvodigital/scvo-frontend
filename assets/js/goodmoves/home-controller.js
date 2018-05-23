var $what = $('#what-jobs');
var $distance = $('#distance-jobs');
var $where = $('#where-jobs');
var $search = $('#search-jobs');
var $searchTerms = $('#search-terms');
var $lat = $('[name="lat"]');
var $lng = $('[name="lng"]');

var $searchView = $('#search-view');
var $browseView = $('#browse-view');

var typeaheadController = new TypeaheadController($what, terms, { highlight: true, minlength: 0 });
var searchTermsController = new SearchTermsController();

typeaheadController.addListener(function(field, term) {
  if (field !== "keywords") {
    searchTermsController.addTerm(field, term);
  } else {
    searchTermsController.keywords = term;
    $search[0].click();
  }
});
searchTermsController.addListener(refreshChips);

var autocomplete;
function initMap() {
  var autocompleteInput = $where[0];
  var autocompleteOptions = {
    'types': ['(regions)'],
    'componentRestrictions': {
      'country': 'gb'
    }
  };
  autocomplete = new google.maps.places.Autocomplete(autocompleteInput, autocompleteOptions);
  autocomplete.addListener('place_changed', autocompleteChange);
  //geolocate();
}

$distance.on('change', function(evt) {
  searchTermsController.distance = $distance.val();
});

$search.on('click', function() {
  var queryObject = searchTermsController.queryObject.call(searchTermsController);
  console.log(JSON.stringify(queryObject, null, 4));
  var queryString = $.param(queryObject);
  window.location.href = '/search?' + queryString;
});

function autocompleteChange(evt) {
  var place = this.getPlace();
  // console.log(place.formatted_address);
  if (place.geometry.location) {
    searchTermsController.location = place.formatted_address;
    searchTermsController.lat = place.geometry.location.lat();
    searchTermsController.lng = place.geometry.location.lng();
    $where.val(place.formatted_address);
  }
}

function searchView() {
  $searchView.show();
  $browseView.hide();
}
function browseView() {
  $searchView.hide();
  $browseView.show();
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('GEOLOCATION:', position, $distance.val());
      searchTermsController.lat = position.coords.latitude;
      searchTermsController.lng = position.coords.longitude;
      reverseLookup(position.coords.latitude, position.coords.longitude);
    });
  } else {
    console.log('Getting All');
  }
}

function reverseLookup(latitude, longitude) {
  var base = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  var coords = latitude + ',' + longitude;
  var key = 'AIzaSyCT7vZkJdto5JoAUDx3asuHu7mHcl8UanQ';
  var url = base + coords + '&key=' + key + '&result_type=locality';
  // console.log('GeoLookup URL:', url);
  $.getJSON(url, function(place) {
    if (place.results && place.results.length > 0) {
      var locality = place.results[0].formatted_address;
      searchTermsController.location = locality;
      $where.val(locality);
    }
  });
}

function refreshChips(searchTerms) {
  $searchTerms.empty();
  var termCount = 0;
  var fields = Object.keys(searchTerms.terms);
  for (var f = 0; f < fields.length; ++f) {
    var field = fields[f];
    var fieldTerms = searchTerms.terms[field];
    for (var t = 0; t < fieldTerms.length; ++t) {
      var term = fieldTerms[t];
      var $chip = $('<div />')
        .addClass('mdc-chip mdc-theme--primary-bg')
        .attr({ tabindex: 0 })
        .appendTo($searchTerms);
      var chipText = $('<div />')
        .addClass('mdc-chip__text')
        // .html('<strong>' + field + '</strong>: ' + term)
        .html(term)
        .appendTo($chip);
      var chipClose = $('<i />')
        .addClass('far fa-times-circle mdc-chip__icon mdc-chip__icon--trailing')
        .data({ field: field, term: term })
        .attr({ tabindex: 0, role: 'button' })
        .on('click', function(evt) {
          console.log(evt);
          var btn = $(evt.currentTarget);
          var field = btn.data('field');
          var term = btn.data('term');
          searchTermsController.removeTerm(field, term);
        })
        .appendTo($chip);
      termCount++;
    }
  }
}
