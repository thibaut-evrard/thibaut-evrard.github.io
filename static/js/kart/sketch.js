//////////////////////     GLOBAL VARIABLES     ////////////////////////////////
var mapTexture;
var mpt = [];
var grass;
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
  createTilingMatrix();
  return;
}

function createTilingMatrix() {
  for(var x=0; x<imgWidth+10; x+=10) {
    var row = [];
    for(var y=0; y<imgHeight+10; y+=10) {
      var tiling = 10;
      obj = {
        original: createGraphics(tiling*tileScale,tiling*tileScale),
        compressed: 0,
        x: x*worldScale,
        y: y*worldScale,
        size: tiling * worldScale,
        optimized: true,
      }
      row.push(obj);
    }
    mpt.push(row);
  }
  mapTexture = createGraphics(imgWidth*tileScale,imgHeight*tileScale);
  return;
}

function preload() {
  loadTextures();
}

function setup() {
  createCanvas(windowWidth-30,windowHeight-30, WEBGL);
  rectMode(CENTER);

  worldInteraction = new interaction();

  myEnvironment = new environment();
  level = new track(img,worldScale);
  level.translateTrack();

  cab = new car(level.carStartingPoint,model);
  // myEnvironment.setup();
}

function draw() {
  minZ = 0;
  frameRate(30);
  background(122,250,255);
  myEnvironment.draw();
  level.drawTrack(cab);
  cab.update();
  cab.draw();
  drawCam(cab);
}

//////////////////////     CUSTOM FUNCTIONS    /////////////////////////////////

function drawCam(cab) {
  var camRot = createVector(0,100);
  camRot.rotate(-cab.alpha); //-(cab.v.heading()-(PI/2))/2);
  var x = cab.pos.x - camRot.x;
  var y = cab.pos.y + camRot.y;
  camera(x,y, cab.pos.z + (50-17), cab.pos.x, cab.pos.y, cab.pos.z + 23, 0, 0, -1);
}
