var $what = $('#what-jobs');
var $search = $('#search-jobs');
var $searchTerms = $('#search-terms');

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
      console.log(evt);
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
