window.showGuide = function() {
    // Hide all existing texts
    var elems = document.getElementsByClassName('guide_text'),
        size = elems.length;
    for (var i = 0; i < size; i++) {
        elems[i].style.display = 'none';
    }

    // Get guide text box
    var guide = document.getElementById('settled_status_guide');

    // Get question answers
    var a = getValueFromRadioButton('a');
    var b = getValueFromRadioButton('b');
    var c = getValueFromRadioButton('c');

    if (a && b && c) {
        // If all answers are set
        document.getElementById('guide_'+a+b+c).style.display = 'block';
        guide.style.display = 'block';
    } else {
        // Hide guide box if some answers aren't set
        guide.style.display = 'none';
    }
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
   return null;
}
