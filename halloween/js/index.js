import FaceModelManager from './classes/faceModelManager.js'
import VideoManager from './classes/videoManager.js'
import ThreeScene from './classes/render/threeScene.js'

var video = document.getElementById("video")
var referenceLandmarkIndex = 0;
var faceModel = new FaceModelManager( video );
var videoManager = new VideoManager( video );
var scene = new ThreeScene( 1200, 800 );


async function init() {

  await videoManager.start();
  await faceModel.init( videoManager.size );
  await scene.load();

  animate();
  update();

}
init();


function update() {

  setInterval( async function() {

    var metrics = await faceModel.getMetrics();
    if( metrics != null ) {
      scene.update( metrics );
    }
      // console.log(metrics);

  }, 100);

}

// ANIMATION LOOP -- ANIMATION LOOP --ANIMATION LOOP --ANIMATION LOOP --ANIMATION LOOP --
function animate() {

  requestAnimationFrame( animate );
  scene.animate();
  scene.render();

}
