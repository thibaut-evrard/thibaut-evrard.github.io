//////////////////////     GLOBAL VARIABLES     ////////////////////////////////
var mapTexture;
var grass;
var worldScale = 100;
var tileScale = 9;

var cab;
var myEnvironment;
var obstacles = [];
var minZ;


//track vars
var level;
var img;
var backgroundImage;


//path vars
var pathToTextures = './static/ressources/textures'
var pathToLevel = './static/ressources/level/map'
//////////////////////     P5 METHODS    ///////////////////////////////////////

function loadTextures() {
  grassTexture = loadImage(pathToTextures + '/world/grass.png');
  bushTexture = loadImage(pathToTextures + '/world/bush.png')
  roadTexture = loadImage(pathToTextures + '/world/road.png');
  speedTexture = loadImage(pathToTextures + '/world/speed.png');
  jumpTexture = loadImage(pathToTextures + '/world/jump.png');
  mapTexture = createGraphics(50*tileScale,50*tileScale);
}

function preload() {
  img = loadImage(pathToLevel + '/trackb.png');
  loadTextures();
}

function setup() {
  createCanvas(windowWidth-30,windowHeight-30, WEBGL);
  rectMode(CENTER);

  backgroundImage = loadImage(pathToTextures + '/world/background.png');
  backgroundImage.resize(windowWidth-30,windowHeight-30);
  myEnvironment = new environment();
  level = new track(img,worldScale);
  level.translateTrack();

  cab = new car(level.carStartingPoint,model);
  //myEnvironment.setup();
}

function draw() {
  minZ = 0;
  frameRate(30);
  background(122,250,255);
  myEnvironment.draw(mapTexture);
  level.drawTrack(cab);
  cab.update();
  cab.draw();
  drawCam(cab);
  //model(model);

  //colider();
}

//////////////////////     CUSTOM FUNCTIONS    /////////////////////////////////

function drawCam(cab) {
  var camRot = createVector(0,100);
  camRot.rotate(-cab.alpha-(cab.v.heading()-(PI/2))/2);
  var x = cab.pos.x - camRot.x;
  var y = cab.pos.y + camRot.y;
  camera(x,y, cab.pos.z + (50-17), cab.pos.x, cab.pos.y, cab.pos.z + 23, 0, 0, -1);
}
