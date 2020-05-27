var w = 250;
var h = 250;

var eventManager = new EventTarget();
var firstPass = true;

var videoHandler = new VideoHandler( document.querySelector("video") );
var modelHandler = new ModelHandler();
var hand = new HandMetrics();

var scene = new Scene( document.getElementById("canvas") );
// var handRenderer = new Hand3D( document.getElementById("canvas") );

// preload
async function init() {

  await modelHandler.loadModel();
  await videoHandler.startVideo();
  console.log("ready");

  setupEventManager();

}

// start the update loop once the preload is finished
init().then( function() {

  updateLoop();
  drawLoop();

});


// update loop
function updateLoop() {

  setInterval( async function() {

    // get the data from the model handler
    var predictions = await modelHandler.getPredictions( videoHandler.video );

    if( firstPass == true ) {
      document.getElementById('loading').style.display = "none";
      firstPass == false;
    }

    // stop there if no hand is detected
    if(predictions == null)
      return;

    // update the hand metrics when results are there
    var newPose = hand.getFrame( predictions[0] );

    scene.update( newPose );

  }, 100);

}

var lastTick = performance.now()

function drawLoop( now ) {

  var dt = now - lastTick
  lastTick = now

  scene.render();

  window.requestAnimationFrame(drawLoop);

}


function setupEventManager() {

  eventManager.addEventListener( 'poseRequest', function() {
    eventManager.dispatchEvent( new CustomEvent( 'poseReceived', { 'detail': hand.estimationModel } ) );
  });

  eventManager.addEventListener( 'poseReceived', function( e ) {
    // pose.onPoseReceived( e.detail );
  });

  eventManager.addEventListener( 'updatePrediction', function( e ) {
    document.getElementById( "prediction" ).innerHTML = e.detail;
  });

  eventManager.addEventListener( 'firstHandModel', function( e ) {

    // handRenderer.debugRender.initJoints( e.detail );
    // render.setupHandWireframe( e.detail );

  });

}
