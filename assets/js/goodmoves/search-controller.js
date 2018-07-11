var $what = $('[name="keywords"]');
var $distance = $('#distance');
var $map = $('#map-full');
var $searchTerms = $('#search-terms');
var $detailedResults = $('#detailed-results-container');
var $forms = $('[action="/search"]');

var $saveSearchButton = $('#save-search-button');
var $saveSearchDialog = $('#save-search-dialog');

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

var dialog = new mdc.dialog.MDCDialog(document.querySelector('#save-search-dialog'));

dialog.listen('MDCDialog:accept', function() {
  console.log('saved');
})

dialog.listen('MDCDialog:cancel', function() {
  console.log('canceled');
})

document.querySelector('#save-search-button').addEventListener('click', function (evt) {
  dialog.lastFocusedTarget = evt.target;
  dialog.show();
})
