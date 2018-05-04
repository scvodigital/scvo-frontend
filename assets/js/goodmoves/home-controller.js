var $what = $('#what');
var $distance = $('#distance');
var $where = $('#where');
var $searchTerms = $('#search-terms');

var typeaheadController = new TypeaheadController($what, terms, { highlight: true, minlength: 0 });
var searchTermsController = new SearchTermsController();

typeaheadController.addListener(searchTermsController.addTerm.bind(searchTermsController));
$distance.on('change', function(evt) {
  searchTermsController.setCenter.call(searchTermsController, null, null, $distance.val() || null);
});
//searchTermsController.addListener(vacanciesController.doSearch.bind(vacanciesController));

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
  //geolocate();
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('GEOLOCATION:', position, $distance.val());
      searchTermsController.setCenter(
        position.coords.latitude,
        position.coords.longitude,
        $distance.val()
      );
      reverseLookup(position.coords.latitude, position.coords.longitude);
    });
  } else {
    console.log('Getting All');
    vacanciesController.doSearch({});
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
      $where.val(locality);
    }
  });
}

