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
