// building bocks
// kart: takes care of all the driving expeience and camera
// optimisation: optimises the game to make it run smoother
// circuit: takes care of all the interaction between the driver and the map
// pngtocircuit: translates the png file into a circuit

//////////////////////     GLOBAL VARIABLES     ////////////////////////////////
var brickName = "grass";

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

var cx = 25*100;
var cy = 25*100;


//path vars
var pathToTextures = './static/ressources/textures'
var pathToLevel = './static/ressources/level/map'
//////////////////////     P5 METHODS    ///////////////////////////////////////

function loadTextures() {
  img = loadImage(pathToLevel + '/blank.png');
  var currentTextureFolder = pathToTextures + '/world/default/'
  grassTexture = loadImage(currentTextureFolder + 'grass.png');
  bushTexture = loadImage(currentTextureFolder + 'bush.png');
  roadTexture = loadImage(currentTextureFolder + 'road.png');
  speedTexture = loadImage(currentTextureFolder + 'speed.png');
  jumpTexture = loadImage(currentTextureFolder + 'jump.png');
  wallTexture = loadImage(currentTextureFolder + 'wall.png');
  finishTexture = loadImage(currentTextureFolder + 'finish.png');
  return;
}

function changeBrickName(newName) {
  brickName = newName;
}

function resizeTextures() {
  var size = 12;
  finishTexture.resize(size,size);
  grassTexture.resize(size,size);
  bushTexture.resize(size,size);
  roadTexture.resize(size,size);
  speedTexture.resize(size,size);
  jumpTexture.resize(size,size);
  wallTexture.resize(size,size);
}

function preload() {
  loadTextures();
}

function setup() {
  createCanvas(500,500);
  resizeTextures();

  // the module that handles all the interaction between the car and the game;
  circuit = new circuit();

  // this is the function that creates the circuit from PNG
  buildCircuit = new buildCircuit(img,worldScale);
  buildCircuit.initMiniMap(); // generates the architecture of maps
  buildCircuit.miniMapFromPng(); // builds the map object from the png file
}

function draw() {
  frameRate(30)
  // //gl.enable(gl.DEPTH_TEST);
  // minZ = 0;
  // frameRate(30);

  background(122,250,255);
  circuit.draw();

  // circuit.worldEvent(car);
  //
  //
  // // level.drawTrack(cab);
}
