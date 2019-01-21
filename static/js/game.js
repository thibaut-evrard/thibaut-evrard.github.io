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

var checkpoint = false;
var lapsLeft = 3;


//path vars
var pathToTextures = './static/ressources/textures'
var pathToLevel = './static/ressources/level/map'
//////////////////////     P5 METHODS    ///////////////////////////////////////

function loadTextures() {
  img = loadImage(pathToLevel + '/trackN.png');
  var currentTextureFolder = pathToTextures + '/world/amazonie/'
  backgroundTexture1 = loadImage(currentTextureFolder + '/background/city1.png')
  backgroundTexture2 = loadImage(currentTextureFolder + '/background/city2.png')

  grassTexture = loadImage(currentTextureFolder + 'grass.png');
  bushTexture = [ loadImage(currentTextureFolder + '/bushes/0.png'), loadImage(currentTextureFolder + '/bushes/1.png'), loadImage(currentTextureFolder + '/bushes/2.png') ];
  treeTexture = loadImage(currentTextureFolder + '/trees/0.png');
  roadTexture = loadImage(currentTextureFolder + 'road.png');
  speedTexture = loadImage(currentTextureFolder + 'speed.png');
  jumpTexture = loadImage(currentTextureFolder + 'jump.png');
  wallTexture = loadImage(currentTextureFolder + 'wall.png');
  finishTexture = loadImage(currentTextureFolder + 'finish.png');
  checkpointTexture = loadImage(currentTextureFolder + 'checkpoint.png');
  return;
}

function preload() {
  loadTextures();
}

function setup() {
  createCanvas(windowWidth-30,windowHeight-30, WEBGL);
  gl = document.getElementById('defaultCanvas0').getContext('webgl');
  perspective(PI / 3.0, width / height, 0.1, 50000);

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
  noStroke();

  minZ = 0;
  frameRate(30);
  background(0,0,30);
  circuit.draw();
  circuit.worldEvent(car);
  car.update();
  gl.disable(gl.DEPTH_TEST);
  car.draw();
  gl.enable(gl.DEPTH_TEST);
  drawCam(car);

  if(lapsLeft == 0) {
  }

}

function randomTexture(entity) {
  var a  = int(random(entity.length));
  return entity[a];
}
//////////////////////     CUSTOM FUNCTIONS    /////////////////////////////////

function drawCam(car) {
  var camRot = createVector(0,100);
  camRot.rotate(-car.alpha-(car.v.heading()-(PI/2))/2);//-(car.v.heading()-(PI/2))/2);
  var x = car.pos.x - camRot.x;
  var y = car.pos.y + camRot.y;
  camera(x,y, car.pos.z + (50-25), car.pos.x, car.pos.y, car.pos.z + 10, 0, 0, -1);
}

var vect = new Vector(12,12,0);
vect = vect.add(vect);
console.log("lol");
