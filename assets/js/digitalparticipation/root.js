document.addEventListener('DOMContentLoaded', function() {
    // Material Design Components
    mdc.autoInit();

    // Browser Update
    var $buoop = {notify:{i:-4,f:-4,o:-4,s:-2,c:-4},unsecure:true,api:5};
    function $buo_f(){
     var e = document.createElement("script");
     e.src = "/assets/js/browser-update.min.js";
     document.body.appendChild(e);
    };
    try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
    catch(e){window.attachEvent("onload", $buo_f)}

    window.drawerEl = document.querySelector('.mdc-temporary-drawer');
    window.drawer = mdc.drawer.MDCTemporaryDrawer.attachTo(drawerEl);
    document.querySelector('#menu_button').addEventListener('click', function() {
        window.drawer.open = true;
    });
    drawerEl.addEventListener('MDCTemporaryDrawer:open', function() {
        console.log('Received MDCTemporaryDrawer:open');
    });
    drawerEl.addEventListener('MDCTemporaryDrawer:close', function() {
        console.log('Received MDCTemporaryDrawer:close');
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
                    break;
                case ('redirect'):
                    var url = event.data.url;
                    ngRouter.navigateByUrl(url);
                    break;
            }
        }
    }, false);
});
