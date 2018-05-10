var $what = $('#what-jobs');
var $distance = $('#distance');
var $where = $('#where-jobs');
var $searchTerms = $('#search-terms');
var $lat = $('[name="lat"]');
var $lng = $('[name="lng"]');

var $searchViewJobs = $('#search-view-jobs');
var $searchViewCategories = $('#search-view-categories');
var $searchViewOrganisations = $('#search-view-organisations');
var $searchViewAdvice = $('#search-view-advice');

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
  autocomplete.addListener('place_changed', autocompleteChange);
  //geolocate();
}

function autocompleteChange(evt) {
  var place = this.getPlace();
  // console.log(place.formatted_address);
  if (place.geometry.location) {
    $('[name="lat"]').val(place.geometry.location.lat());
    $('[name="lng"]').val(place.geometry.location.lng());
    $('[name="location"]').val(place.formatted_address);
  }
}

function searchViewJobs() {
  $searchViewJobs.show();
  $searchViewCategories.hide();
  $searchViewOrganisations.hide();
  $searchViewAdvice.hide();
}
function searchViewCategories() {
  $searchViewJobs.hide();
  $searchViewCategories.show();
  $searchViewOrganisations.hide();
  $searchViewAdvice.hide();
}
function searchViewOrganisations() {
  $searchViewJobs.hide();
  $searchViewCategories.hide();
  $searchViewOrganisations.show();
  $searchViewAdvice.hide();
}
function searchViewAdvice() {
  $searchViewJobs.hide();
  $searchViewCategories.hide();
  $searchViewOrganisations.hide();
  $searchViewAdvice.show();
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('GEOLOCATION:', position, $distance.val());
      $('[name="lat"]').val(position.coords.latitude);
      $('[name="lng"]').val(position.coords.longitude);
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
      $where.val(locality);
    }
  });
}
