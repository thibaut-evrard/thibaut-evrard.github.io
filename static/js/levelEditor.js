// building bocks
// kart: takes care of all the driving expeience and camera
// optimisation: optimises the game to make it run smoother
// circuit: takes care of all the interaction between the driver and the map
// pngtocircuit: translates the png file into a circuit

//////////////////////     GLOBAL VARIABLES     ////////////////////////////////
var miniMap = [];
var startPoint = { x:0, y:0 }

var worldScale = 100;
var tileScale = 1;

var cab;
var myEnvironment;
var obstacles = [];
var minZ;

//track vars
var level;
var img;
var imgWidth = 50;
var imgHeight = 50;
var backgroundImage;

var cx = 0;
var cy = 0;


//path vars
var pathToTextures = './static/ressources/textures'
var pathToLevel = './static/ressources/level/map'
//////////////////////     P5 METHODS    ///////////////////////////////////////

function loadTextures() {
  img = loadImage(pathToLevel + '/blank.png');
  grassTexture = loadImage(pathToTextures + '/world/grass.png');
  bushTexture = loadImage(pathToTextures + '/world/bush.png');
  roadTexture = loadImage(pathToTextures + '/world/road.png');
  speedTexture = loadImage(pathToTextures + '/world/speed.png');
  jumpTexture = loadImage(pathToTextures + '/world/jump.png');
  wallTexture = loadImage(pathToTextures + '/world/wall.png');
  finishTexture = loadImage(pathToTextures + '/world/finish.png');
  return;
}

function preload() {
  loadTextures();
}

function setup() {
  createCanvas((2*windowWidth)/3-30,windowHeight-30, WEBGL);
  gl = document.getElementById('defaultCanvas0').getContext('webgl');
  rectMode(CENTER);

  // the module that handles all the interaction between the car and the game;
  circuit = new circuit();

  // this is the function that creates the circuit from PNG
  buildCircuit = new buildCircuit(img,worldScale);
  buildCircuit.initMiniMap(); // generates the architecture of maps
  buildCircuit.miniMapFromPng(); // builds the map object from the png file
}

function draw() {
  // //gl.enable(gl.DEPTH_TEST);
  // minZ = 0;
  // frameRate(30);
  // background(122,250,255);
  // circuit.draw();
  // circuit.worldEvent(car);
  //
  //
  // // level.drawTrack(cab);
  moveCam();
  drawCam();

}

//////////////////////     CUSTOM FUNCTIONS    /////////////////////////////////
function moveCam() {
  if(keyIsDown(UP_ARROW)) cy-= 30;
  if(keyIsDown(DOWN_ARROW)) cy+= 30;
  if(keyIsDown(LEFT_ARROW)) cx-= 30;
  if(keyIsDown(RIGHT_ARROW)) cx+= 30;
}

function drawCam() {
  camera(cx,cy, 3000, cx, cy, 0, 0, 1, 0);
}
