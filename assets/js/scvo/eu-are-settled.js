document.addEventListener('DOMContentLoaded', function() {
    window.displayGuide = function() {
        // Hide all existing texts
        var elems = document.getElementsByClassName('guide_text'),
            size = elems.length;
        for (var i = 0; i < size; i++) {
            var text = elems[i];
            text.style.display = 'none';
        }

        // Get guide text box
        var guide = document.getElementById('settled_status_guide');

        // Get question answers
        var a = document.settled_status.a.value;
        var b = document.settled_status.b.value;
        var c = document.settled_status.c.value;

        if (a && b && c) {
            // If all answers are set
            var guide_text = document.getElementById('guide_'+a+b+c);
            guide_text.style.display = 'block';
            guide.style.display = 'block';
        } else {
            // Hide guide box if some answers aren't set
            guide.style.display = 'none';
        }
    }
});