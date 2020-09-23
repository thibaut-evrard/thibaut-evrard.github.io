var hotspotButtons = document.getElementsByClassName("hotspot");

var buttons = []
for( var i = 0; i<hotspotButtons.length; i++ ) {

  var an = hotspotButtons[i].getElementsByClassName("annotation")[0]
  an.style.visibility = "hidden"

  hotspotButtons[i].onclick = function() {

    var button = this;
    var annotation = button.getElementsByClassName("annotation")[0];
    var visibility = annotation.style.visibility

    if( annotation.style.visibility == "hidden" ) {
      annotation.style.visibility = ""
      this.style.backgroundColor = "red"
    }
    else {
      annotation.style.visibility = "hidden"
      this.style.backgroundColor  = "blue"
    }

  }

}
