var video = document.getElementById("video")
var referenceLandmarkIndex = 0;
var metrics = new FaceMetrics();

var faceModel = new FaceModelManager( video );
var videoManager = new VideoManager( video );
var scene = new Sketch( { width: 500, height: 700 } )


async function init() {

  await faceModel.init();
  await videoManager.start();
  console.log("done");

  animate();
  update();

}
init();


function update() {

  setInterval( async function() {

    var metrics = await faceModel.getMetrics();
    if( metrics != null )
      scene.update( metrics )
    // scene.updateCamera( metrics );

  }, 100);

}

// ANIMATION LOOP -- ANIMATION LOOP --ANIMATION LOOP --ANIMATION LOOP --ANIMATION LOOP --
function animate() {

  requestAnimationFrame( animate );
  // scene.render();

}

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
