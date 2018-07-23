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

typeaheadController.addListener(function(field, term) {
  if (field !== "keywords") {
    addChip(field, term);
  } else {
    $search[0].click();
  }
  refreshChips();
});

$where.on('keypress', function(evt) {
  var keyCode = evt.keyCode || evt.which;
  if (keyCode === 13) {
    evt.preventDefault();
    return false;
  }
});

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
      // console.log('GEOLOCATION:', position, $distance.val());
      searchTermsController.lat = position.coords.latitude;
      searchTermsController.lng = position.coords.longitude;
      reverseLookup(position.coords.latitude, position.coords.longitude);
    });
  } else {
    // console.log('Getting All');
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

function addChip(field, term) {
  var slug = slugify(term);
  var $chip = $('<div />')
    .addClass('mdc-chip mdc-theme--primary-bg')
    .attr({ tabindex: 0 })
    .appendTo($searchTerms);
  var $chipText = $('<div />')
    .addClass('mdc-chip__text')
    .html(term)
    .appendTo($chip);
  var $chipField = $('<input />')
    .attr({ type: 'hidden', name: field + '[]', value: slug })
    .appendTo($chip);
  var $chipClose = $('<i />')
    .addClass('far fa-times-circle mdc-chip__icon mdc-chip__icon--trailing')
    .data({ field: field, term: slug })
    .attr({ tabindex: 0, role: 'button' })
    .on('click', function(evt) {
      // console.log(evt);
      $chip.remove();
    })
    .appendTo($chip);
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

$(document).ready(function() {
  $('.scrolling-grid').each(function(i, o) {
    // console.log(o);
    $(o).find('.scroll-left').on('click', function() {
      var by = $(o).scrollLeft() - ($(o).width() * (3/4));
      if (o.scroll) {
        o.scroll({ left: by, top: 0, behavior: 'smooth'});
      } else {
        $(o).scrollLeft(by);
      }
    });
    $(o).find('.scroll-right').on('click', function() {
      var by = $(o).scrollLeft() + ($(o).width() * (3/4));
      if (o.scroll) {
        o.scroll({ left: by, top: 0, behavior: 'smooth'});
      } else {
        $(o).scrollLeft(by);
      }
    });
  });
});
