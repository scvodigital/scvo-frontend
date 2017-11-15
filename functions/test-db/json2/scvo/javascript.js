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
