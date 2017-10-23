var drawerEl = document.querySelector('.mdc-temporary-drawer');
var MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
var drawer = new MDCTemporaryDrawer(drawerEl);
document.querySelector('.demo-menu').addEventListener('click', function() {
    drawer.open = true;
});
drawerEl.addEventListener('MDCTemporaryDrawer:open', function() {
    console.log('Received MDCTemporaryDrawer:open');
});
drawerEl.addEventListener('MDCTemporaryDrawer:close', function() {
    console.log('Received MDCTemporaryDrawer:close');
});

var search = document.querySelector('#search');
search.addEventListener('keypress', function(evt) {
    if(evt.charCode === 13){
        var query = search.value;
        var url = '/search;query=' + encodeURIComponent(query);
        window.location.href = url;
    }
});
(function(){
    var href = window.location.href;
    var index = href.indexOf('query=');
    if(index > -1){
        var query = href.split('query=')[1];
        var eoq = query.indexOf(';');
        if(eoq > -1){
            query = afterQuery.substr(0, eoq);
        }
        search.value = query;
    }
})();
