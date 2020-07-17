var video = document.querySelector("video")
var referenceLandmarkIndex = 0;
var metrics = new FaceMetrics();

var faceModel = new FaceModelManager( video );
var videoManager = new VideoManager( video );

var scene = new Scene( window.innerWidth, window.innerHeight );


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
    scene.updateCamera( metrics );

  }, 100);

}

// ANIMATION LOOP -- ANIMATION LOOP --ANIMATION LOOP --ANIMATION LOOP --ANIMATION LOOP --
function animate() {

  requestAnimationFrame( animate );
  scene.render();

}
