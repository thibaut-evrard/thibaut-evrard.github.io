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


//path vars
var pathToTextures = './static/ressources/textures'
var pathToLevel = './static/ressources/level/map'
//////////////////////     P5 METHODS    ///////////////////////////////////////

function loadTextures() {
  img = loadImage(pathToLevel + '/trackb.png');
  grassTexture = loadImage(pathToTextures + '/world/grass.png');
  bushTexture = loadImage(pathToTextures + '/world/bush.png');
  roadTexture = loadImage(pathToTextures + '/world/road.png');
  speedTexture = loadImage(pathToTextures + '/world/road.png');
  jumpTexture = loadImage(pathToTextures + '/world/jump.png');
  wallTexture = loadImage(pathToTextures + '/world/wall.png');
  return;
}

function preload() {
  loadTextures();
}

function setup() {
  createCanvas(windowWidth-30,windowHeight-30, WEBGL);
  rectMode(CENTER);

  // the module that handles all the interaction between the car and the game;
  circuit = new circuit();

  // setup the optimisation module for the game
  optimisation = new optimisation();
  optimisation.createOptimisedCanvas();

  // this is the function that creates the circuit from PNG
  buildCircuit = new buildCircuit(img,worldScale);
  buildCircuit.initMiniMap(); // generates the architecture of maps
  buildCircuit.miniMapFromPng(); // builds the map object from the png file

  // get the starting point of the car from the builder class
  car = new car(startPoint,model);
}

function draw() {
  minZ = 0;
  frameRate(30);
  background(122,250,255);
  circuit.draw();
  circuit.worldEvent(car);
  car.update();
  car.draw();
  // circuit.drawTex2d(miniMap.tex2d);
  // circuit.drawInteractibles(maps.interactibles);


  // level.drawTrack(cab);

  drawCam(car);
}

//////////////////////     CUSTOM FUNCTIONS    /////////////////////////////////

function drawCam(car) {
  var camRot = createVector(0,100);
  camRot.rotate(-car.alpha); //-(cab.v.heading()-(PI/2))/2);
  var x = car.pos.x - camRot.x;
  var y = car.pos.y + camRot.y;
  camera(x,y, car.pos.z + (50-17), car.pos.x, car.pos.y, car.pos.z + 23, 0, 0, -1);
}
