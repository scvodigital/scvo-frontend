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
  if ($('input[name="' + field + '[]"][value="' + slug + '"]').length > 0) return;
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
    $(o).parent().find('.scroll-left').on('click', function() {
      var $o = $(o);
      var currentLeft = $o.scrollLeft();
      var third = $o.width() * (3/5);
      var by = currentLeft - third;
      if (o.scroll) {
        o.scroll({ left: by, top: 0, behavior: 'smooth'});
      } else {
        $o.scrollLeft(by);
      }
    });
    $(o).parent().find('.scroll-right').on('click', function() {
      var $o = $(o);
      var currentLeft = $o.scrollLeft();
      var third = $o.width() * (3/5);
      var by = currentLeft + third;
      if (o.scroll) {
        o.scroll({ left: by, top: 0, behavior: 'smooth'});
      } else {
        $o.scrollLeft(by);
      }
    });

    showHideScrollButtons(o);
  });

  $('.scrolling-grid').on('scroll', function(evt) {
    showHideScrollButtons(evt.currentTarget);
  });
  function showHideScrollButtons(o) {
    var $o = $(o);

    var $leftButton = $o.parent().find('.scroll-left');
    var $rightButton = $o.parent().find('.scroll-right');
    var currentLeft = $o.scrollLeft();
    var maxLeft = $o[0].scrollWidth - $o.width() - 1;

    if (currentLeft <= 0) {
      $leftButton.hide();
    } else {
      $leftButton.show();
      $leftButton.css('display', 'flex');
    }

    if (currentLeft >= maxLeft) {
      $rightButton.hide();
    } else {
      $rightButton.show();
      $rightButton.css('display', 'flex');
    }

  }
});
