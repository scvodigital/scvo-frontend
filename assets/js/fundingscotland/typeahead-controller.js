function TypeaheadController(textbox, terms, options) {
  var engines = {};
  var fields = Object.keys(terms);
  var typeaheadArgs = [options];
  var listeners = [];

  for (var i = 0; i < fields.length; ++i) {
    var field = fields[i];
    engines[field] = createEngine(field);
    var dataset = createDataset(field);
    typeaheadArgs.push(dataset);
  }

  var instance = textbox.typeahead.apply(textbox, typeaheadArgs)
    .on('typeahead:select', typeaheadSelect)
    .on('typeahead:autocomplete', typeaheadSelect)
    .on('keydown', function(ev) {
      switch (ev.keyCode) {
        case (9):
          ev.preventDefault();
          break;
        case (13):
          ev.preventDefault();
          var val = textbox.val();
          if (val) {
            updateTrigger('keywords', val);
            textbox.typeahead('val', '');
            refocus();
          }
          break;
      }
    });

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

  function typeaheadSelect(ev, suggestion) {
    updateTrigger(suggestion.field, suggestion.term);
    textbox.typeahead('val', '').typeahead('close');
    refocus();
  }

  function refocus() {
    setTimeout(function() {
      textbox.focus();
    }, 100);
  }

  function createEngine(field) {
    return new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('term'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: terms[field]
    });
  }

  function createDataset(field) {
    var title = field.charAt(0).toUpperCase() + field.slice(1);
    return {
      name: field,
      source: engines[field],
      display: 'term',
      templates: {
        header: '<h3>' + title + '</h3>'
      }
    };
  }

  function updateTrigger(field, value) {
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i](field, value);
    }
  }
}
