window.drawerEl = document.querySelector('.mdc-drawer--temporary');
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
