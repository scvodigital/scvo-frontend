window.showGuide = function() {
    // Hide all existing texts
    var elems = document.getElementsByClassName('guide_text'),
        size = elems.length;
    for (var i = 0; i < size; i++) {
        elems[i].style.display = 'none';
    }
    document.getElementById('settled_status_q_b').style.display = 'none';
    document.getElementById('settled_status_q_c').style.display = 'none';
    document.getElementById('settled_status_q_d').style.display = 'none';

    // Get guide text box
    var guide = document.getElementById('settled_status_guide');

    // Get question answers
    var a = getValueFromRadioButton('a');
    a = (typeof a === 'undefined') ? 0 : a;

    var b = getValueFromRadioButton('b');
    b = (typeof b === 'undefined') ? 0 : b;

    var c = getValueFromRadioButton('c');
    c = (typeof c === 'undefined') ? 0 : c;

    var d = getValueFromRadioButton('d');
    d = (typeof d === 'undefined') ? 0 : d;

    if (a == 1) {
        b = 0;
        document.getElementById('settled_status_q_c').style.display = 'block';
    } else if (a == 2) {
        c = 0;
        d = 0;
        document.getElementById('settled_status_q_b').style.display = 'block';
    }
    if (c == 1) {
        d = 0;
    } else if (c == 2) {
        document.getElementById('settled_status_q_d').style.display = 'block';
    }
    console.log("show "+'guide_'+a+b+c+d);

    var guide = document.getElementById('guide_'+a+b+c+d);
    if (guide) guide.style.display = 'block';
};

function getValueFromRadioButton(name) {
   //Get all elements with the name
   var buttons = document.getElementsByName(name);
   for(var i = 0; i < buttons.length; i++) {
      //Check if button is checked
      var button = buttons[i];
      if(button.checked) {
         //Return value
         return button.value;
      }
   }
   //No radio button is selected.
   return 0;
}
