var from = document.querySelector('#link-gen-from');
var to = document.querySelector('#link-gen-to');

from.onchange = linkGenChange;
to.onchange = linkGenChange;

function linkGenChange(evt) {
    var link = document.querySelector('#link-gen-link'); 
    if (from.value && to.value) {
        var fromTime = new Date(from.value).getTime();
        var toTime = new Date(to.value).getTime();
        if (from.value < to.value) {
            var range = fromTime + '-' + toTime;
            var encoded = btoa(range);
            var base = window.location.protocol + '//' + window.location.host;
            var url = base + '/funding-updates/' + encoded;
            
            link.innerHTML = '<a href="' + url + '" target="_blank">' + url + '</a>';
            link.style.color = 'auto';
        } else { 
            link.innerHTML = 'Select a valid date range';
            link.style.color = '#aa0000';
        }
    } else {
        link.innerHTML = 'Select a date range';
        link.style.color = '#aa0000';
    }
}
