style();
function style() {

  console.log("looool")
  var w = window.innerWidth;
  var h = window.innerHeight;

  if( h > w ) {

    $("#film").css({
      "height": "auto",
      "width": "100vw"
    })

    $("#avatar").css({
      "left": "80vw",
      "top": "87vw",
      "width": "17vw",
      "height": "17vw"
    })


    $("#video").css({
      "top": "60vh",
      "left": "30vw",
      "height": "20vh",
      "width": "auto"
    })



  }

}
