var drawerEl = document.querySelector('.mdc-temporary-drawer');
var drawer = mdc.drawer.MDCTemporaryDrawer.attachTo(drawerEl);
console.log('DRAWER:', drawer);
document.querySelector('#menu_button').addEventListener('click', function() {
    drawer.open = true;
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
                console.log('CHANGE EVT:', evt);
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
