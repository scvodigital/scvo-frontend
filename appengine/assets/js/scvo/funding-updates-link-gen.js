document.addEventListener('DOMContentLoaded', function() {
    var text = document.querySelector('#link-gen-text');
    text.style.display = "none";
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
                var url = 'https://scvo.org/funding/updates/' + encoded;

                link.innerHTML = '<a href="' + url + '" target="_blank" class="noext">' + url + '</a>';
                link.style.color = 'auto';
                text.style.display = "block";
            } else {
                link.innerHTML = 'Select a valid date range';
                link.style.color = '#aa0000';
                text.style.display = "none";
            }
        } else {
            link.innerHTML = 'Select a date range';
            link.style.color = '#aa0000';
            text.style.display = "none";
        }
    }
});
