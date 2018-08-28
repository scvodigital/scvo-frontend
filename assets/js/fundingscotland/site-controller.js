var FundingScotlandController = Class.extend({
  app: null,
  config: null,
  displayMode: null,
  displayModes: [
    { name: 'mobile', min: 0, max: 599 },
    { name: 'tablet', min: 600, max: 959 },
    { name: 'desktop', min: 960, max: 20000 }
  ],
  snackbar: null,
  ie: false,

  init: function(firebaseConfig) {
    this.firebaseConfig = firebaseConfig;
    this.setupComponents();
    this.setupFirebase();

    if (navigator.appName.indexOf('Microsoft') > -1 || navigator.userAgent.indexOf('Trident') > -1) {
      this.ie = true;
    }

    var that = this;
    $(window).on('resize', function() {
      that.windowResized.call(that);
    });
    this.windowResized();

    // Headroom
    var header = document.querySelector("header.top-bar-stuck");
    var headroom  = new Headroom(header, {
      "offset": 138,
      "tolerance": 5
    });
    headroom.init();
  },

  windowResized: function() {
    var width = $(window).width();
    var newDisplayMode = null;
    this.displayModes.forEach(function(mode) {
      if (width >= mode.min && width < mode.max) {
        newDisplayMode = mode.name;
      }
    });
    if (newDisplayMode !== this.displayMode) {
      this.displayMode = newDisplayMode;
      this.displayModeChanged();
    }
    this.fie();
  },

  displayModeChanged: function() {
    // console.log('Display Mode:', this.displayMode);
    var that = this;
    $('.mdc-drawer--occasional').each(function(i, o) {
      if (that.displayMode === 'desktop') {
        console.log(that.displayMode, o);
        o.MDCTemporaryDrawer.destroy();
        //$('#sidebar-temporary')
        //  .removeClass('mdc-drawer--temporary')
        //  .addClass('mdc-drawer--permanent');
      } else {
        console.log(that.displayMode, o);
        o.MDCTemporaryDrawer.initialize();
        //$('#sidebar-temporary')
        //  .removeClass('mdc-drawer--permanent')
        //  .addClass('mdc-drawer--temporary');
      }
    });
  },

  fie: function() {
    if (!this.ie) return;
    $('.mdc-drawer--occasional .mdc-drawer__drawer').each(function(i, o) {
      var $o = $(o);
      var parentHeight = $o.parent().height();
      $o.css('height', parentHeight);
    });
  },

  setupComponents: function() {
    var that = this;
    mdc.autoInit();

    // Think we just need the one global snackbar
    var $snackbar = $('#app-snackbar');
    this.snackbar = new mdc.snackbar.MDCSnackbar($snackbar[0]);
    $snackbar.data('defaultCss', {
      'background-color': $snackbar.css('background-color'),
      color: $snackbar.css('color')
    });

    // Ajax Forms
    $('form[data-ajax-form][data-success-message][data-failure-message]').submit(function(evt) {
      evt.preventDefault();
      var $o = $(event.currentTarget);
      var url = $o.attr('action');
      var method = $o.attr('method') || 'GET';
      var dataType = $o.attr('data-response-type') || 'html';
      var successMessage = $o.attr('data-success-message');
      var failureMessage = $o.attr('data-failure-message');

      var request = {
        url: url,
        method: method,
        dataType: dataType,
        success: function(data, status, xhr) {
          goodmoves.snackbarShow({
            message: successMessage
          });
        },
        error: function(xhr, status, err) {
          goodmoves.snackbarShow({
            message: failureMessage,
            backgroundColor: '#dd4b39'
          });
        }
      };

      if (method.toUpperCase() === 'GET') {
        request.url += (request.url.indexOf('?') > -1 ? '&' : '') + $o.serialize();
      } else {
        var data = {};
        var params = $o.serializeArray();
        console.log('PARAMS:', params);
        for (var p = 0; p < params.length; p++) {
          var param = params[p];
          if (!data.hasOwnProperty(param.name)) {
            data[param.name] = param.value;
          } else {
            if (!$.isArray(data[param.name])) {
              data[param.name] = [data[param.name]];
            }
            data[param.name].push(param.value);
          }
        }
        request.data = data;
      }
      console.log('REQUEST:', request);
      $.ajax(request);
    });

    $('[data-mdc-auto-init="MDCTextField"][novalidate]').each(function(i, o) {
      o.MDCTextField.getDefaultFoundation().useCustomValidityChecking = true;
    });

    // Menu buttons
    $('[data-menu-target]').each(function(i, o) {
      var selector = $(o).attr('data-menu-target');
      var menuEl = $(selector)[0];
      $(o).on('click', function() {
        menuEl.MDCMenu.open = !menuEl.MDCMenu.open;
      });
    });

    // Dialog activator buttons
    $('[data-dialog-target]').each(function(i, o) {
      var selector = $(o).attr('data-dialog-target');
      var dialogEl = $(selector)[0];
      $(o).on('click', function() {
        dialogEl.MDCDialog.show();
      });
    });

    // Temporary drawer buttons
    $('[data-drawer-target]').each(function(i, o) {
      var selector = $(o).attr('data-drawer-target');
      var drawerEl = $(selector)[0];
      var drawerType = $(selector).attr('data-mdc-auto-init');
      if (drawerType) {
        $(o).on('click', function() {
          drawerEl[drawerType].open = !drawerEl[drawerType].open;
        });
      }
    });

    // Collapsibles
    $('[data-collapse-target]').off('click').on('click', function(evt) {
      // console.log('Collapse click:', evt);
      var $el = $(evt.currentTarget);
      var selector = $el.attr('data-collapse-target');
      var $target = $(selector);
      var $caption = $el.find('.mdc-typography--caption');
      var $icon = $el.find('.far');
      if ($target.is(':visible')) {
        $target.hide();
        $caption.show();
        $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
      } else {
        $target.show();
        $caption.hide();
        $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
      }
    });

    // Ajax Chips
    $('[data-ajax-chip]').each(function(i, o) {
      var $chip = $(o);
      var options = $chip.data('ajax-chip');
      var chip = new mdc.chips.MDCChip(o);

      options.onUrl = options.onUrl || options.toggleUrl;
      options.offUrl = options.offUrl || options.onUrl;
      options.onData = options.onData || options.toggleData || null;
      options.offData = options.offData || options.onData;
      options.onMethod = options.onMethod || options.toggleMethod || 'GET';
      options.offMethod = options.offMethod || options.onMethod;

      $chip.on('click', function() {
        if (!$chip.data('disabled')) {
          $chip.data('disabled', true);
          $chip.css('opacity', 0.5);
          var selected = $chip.hasClass('mdc-chip--selected');
          var ajax = {
            url: selected ? options.offUrl || options.onUrl : options.onUrl,
            method: selected ? options.offMethod || options.onMethod : options.onMethod,
            data: selected ? options.offData || options.onData || null : options.onData || null,
            dataType: 'html',
            success: function() {
              if (options.onClasses) {
                var selectors = Object.keys(options.onClasses);
                for (var s = 0; s < selectors.length; ++s) {
                  var selector = selectors[s];
                  var cssClass = options.onClasses[selector];
                  $(selector)[selected ? 'removeClass' : 'addClass'](cssClass);
                }
              }
              if (options.offClasses) {
                var selectors = Object.keys(options.offClasses);
                for (var s = 0; s < selectors.length; ++s) {
                  var selector = selectors[s];
                  var cssClass = options.offClasses[selector];
                  $(selector)[!selected ? 'removeClass' : 'addClass'](cssClass);
                }
              }
              // $chip.find('.mdc-chip__icon--leading')[selected ? 'removeClass' : 'addClass']('mdc-chip__icon--leading-hidden');
              $chip.find('.mdc-chip__text').text(!selected ? options.onText : options.offText);
              chip.foundation.setSelected(!selected);
              $chip.data('disabled', false);
              $chip.css('opacity', 1);
            },
            error: function() {
              console.error('Failed toggle', options, arguments);
              $chip.data('disabled', false);
              $chip.css('opacity', 1);
            }
          };
          $.ajax(ajax);
        }
      });
    });

    $('textarea[data-autosize]').each(function() {
      var offset = this.offsetHeight - this.clientHeight;

      var resizeTextarea = function(el) {
        var $el = $(el);
        if ($el.is(':visible')) {
          $el.css('height', 'auto').css('height', Math.max(el.scrollHeight, offset));
        } else {
          var hiddenParent = $el;
          while (hiddenParent.parent()[0] && !hiddenParent.parent().is(':visible')) {
            hiddenParent = hiddenParent.parent();
          }
          var state = hiddenParent.attr('style') || '';
          hiddenParent.css({ 'visibility': 'hidden', 'display': 'block' });
          $el.css('height', 'auto').css('height', Math.max(el.scrollHeight, offset));
          hiddenParent.attr('style', state);
        }
      };
      $(this).on('keyup input', function() { resizeTextarea(this); });
      resizeTextarea(this);
    });
  },

  setupFirebase: function() {
    // Initialize Firebase
    this.app = firebase.initializeApp(this.firebaseConfig);
  },

  // Utility functions
  setCookie: function(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; secure";
  },

  disable: function(elements, disable) {
    disable = typeof disable === 'undefined' ? true : disable;
    for (var e = 0; e < elements.length; ++e) {
      var element = elements[e];
      var opacity = disable ? 0.5 : 1;
      $(element).prop('disabled', disable).css('opacity', opacity);
    }
  },

  snackbarShow: function(options) {
    var $snackbar = $('#app-snackbar');
    $snackbar.css($snackbar.data('defaultCss'));

    if (options.backgroundColor) {
      $snackbar.css('background-color', options.backgroundColor);
      delete options.backgroundColor;
    }
    if (options.color) {
      $snackbar.css('color', options.color);
      delete options.color;
    }
    this.snackbar.show(options);
  }
});

var fundingscotland = null;
$(document).ready(function() {
  fundingscotland = new FundingScotlandController({
    apiKey: "AIzaSyDIUNnyGeZY3sO8gGIf-_2dgO49xKij5zI",
    authDomain: "scvo-net.firebaseapp.com",
    databaseURL: "https://scvo-net.firebaseio.com",
    projectId: "scvo-net",
    storageBucket: "scvo-net.appspot.com",
    messagingSenderId: "782194712584"
  });
});
