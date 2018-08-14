document.addEventListener('DOMContentLoaded', function() {
    // Material Design Components
    mdc.autoInit();

    // Menu buttons
    $('[data-menu-target]').each(function(i, o) {
      var selector = $(o).attr('data-menu-target');
      var menuEl = $(selector)[0];
      $(o).on('click', function() {
        menuEl.MDCMenu.open = !menuEl.MDCMenu.open;
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

    window.setupAutoSearchForms = function() {
        var autoSearchForms = document.querySelectorAll('form[data-auto-search="true"]');
        console.log('setupAutoSearchForms()', autoSearchForms);

        for (var x = 0; x < autoSearchForms.length; x++) {
            var searchForm = autoSearchForms[x];
            var submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'submit');
            submitButton.setAttribute('style', 'display:none');
            searchForm.appendChild(submitButton);

            var changeTriggers = searchForm.querySelectorAll('select,input[type="checkbox"],input[type="radio"]');

            for (var y = 0; y < changeTriggers.length; y++) {
                changeTriggers[y].addEventListener('change', function(evt) {
                    var clearInput = evt.srcElement.getAttribute('data-clear-input');
                    if (clearInput) {
                        document.querySelector(clearInput).value = null;
                    }
                    submitButton.click();
                });
            }
        }
    }
    window.setupAutoSearchForms();

    window.addEventListener("message", (event) => {
        if (event.data.hasOwnProperty('event')) {
            console.log('Post Message Event', event.data);
            switch (event.data.event) {
                case ('resize'):
                    document.querySelector('iframe[src*="' + event.origin + '"]').style.height = (30+event.data.height) + 'px';
                    window.scrollTo(0, 0);
                    break;
                case ('redirect'):
                    var url = event.data.url;
                    ngRouter.navigateByUrl(url);
                    break;
            }
        }
    }, false);
});
