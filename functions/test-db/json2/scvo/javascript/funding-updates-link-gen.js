var from = document.querySelector('#link-gen-from');
var to = document.querySelector('#link-gen-to');

from.onchange = linkGenChange;
to.onchange = linkGenChange;

function linkGenChange(evt) {
    var fromTime = new Date(from.value).getTime();
    var toTime = new Date(to.value).getTime();
    var range = fromTime + '-' + toTime;
    var encoded = btoa(range);
    var base = window.location.protocol + '//' + window.location.host;
    var url = base + '/funding-updates/' + encoded;
    
    var link = document.querySelector('#link-gen-link'); 
    link.innerText = url;
    link.setAttribute('href', url);
}
