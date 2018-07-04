document.addEventListener('DOMContentLoaded', function() {
    var menu = new mdc.menu.MDCMenu(document.querySelector('#share-menu'));
    document.querySelector('#share-menu-button').addEventListener('click', () => menu.open = !menu.open);
});
