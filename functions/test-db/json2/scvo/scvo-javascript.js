window.onload = function () {
    document.getElementById("spinner").style.display = "none";
}

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

var header = document.querySelector("header.mdc-toolbar");
var headroom  = new Headroom(header, {
    "offset": 205,
    "tolerance": 5
});
headroom.init();

window.share = function(where) {
    var ogTitleEl = document.head.querySelector('meta[property="og:title"]');
    var ogDescriptionEl = document.head.querySelector('meta[property="og:description"]');
    var pageTitle = ogTitleEl ? ogTitleEl.content : document.title;
    var pageDescription = ogDescriptionEl ? ogDescriptionEl.content : '';
    var pageUrl = window.location.href;

    var shareUrl, shareHeight, shareWidth;

    switch (where) {
        case ('facebook'):
            shareHeight = 420;
            shareWidth = 550;
            shareUrl = 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(pageUrl);
            break;
        case ('twitter'):
            shareHeight = 420;
            shareWidth = 550;
            shareUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(pageTitle) + '&via=scvotweet&url=' + encodeURIComponent(pageUrl);
            break;
        default: return;
    }

    console.log(shareUrl);

    var shareWindow = window.open(shareUrl, 'share-window', 'height=' + shareHeight + ',width=' + shareWidth + ',location=0,menubar=0,status=0,resizable=0,toolbar=0');
}

var autoSearchForms = document.querySelectorAll('form[data-auto-search="true"]');
for (var x = 0; x < autoSearchForms.length; x++) {
    var searchForm = autoSearchForms[x];

    var dropDowns = searchForm.querySelectorAll('select');
    var checkboxes = searchForm.querySelectorAll('input[type="checkbox"]');

    for (var y = 0; y < dropDowns.length; y++) {
        var dropDown = dropDowns[y];

        dropDown.addEventListener('change', function() {
            searchForm.submit();
        });
    }

    for (var y = 0; y < checkboxes.length; y++) {
        var checkboxes = checkboxes[y];

        checkboxes.addEventListener('change', function() {
            checkboxes.submit();
        });
    }
}
