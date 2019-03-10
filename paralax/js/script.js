// handling the size of the screen
var docW = document.documentElement.clientWidth,
docH = document.documentElement.clientHeight,
appH = 640;
var windowRatio = docW / docH;
console.log(windowRatio);

var heightEnlarge = docH/appH;
console.log(heightEnlarge);
var w = document.documentElement.clientWidth/heightEnlarge;

var resolution = window.devicePixelRatio;
if(heightEnlarge < 1) {
  resolution = window.devicePixelRatio * heightEnlarge;
}


//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Width = w,
    Height = appH;

//Create a Pixi Application object
let app = new Application({
    width: Width,
    height: Height,
    antialias: false,
    transparent: false,
    autoResize: true,
    autoDensity: true,
    resolution: resolution
  }
);
document.querySelector('#iframe').appendChild(app.view);

resize();
function resize() {
  app.renderer.view.style.width = document.documentElement.clientWidth + 'px';
  app.renderer.view.style.height = document.documentElement.clientHeight + 'px';
}

var soundAssets;
let WorldAssets = { img: "assets/WorldAssets.png", atlas: "assets/WorldAssets.json" };

// loading all the data for the game
var pixiLoaded = false,
soundsLoaded = false,
fontLoaded = false;
loadFont();
loadPixiAssets();
loadSounds();
function loadCheck(type) {
  console.log(type + " loaded...")
  if(pixiLoaded && soundsLoaded) {
    console.log("loading finished...");
    setup();
  }
}

function setup() {
  console.log("now setting up the game...")
  // setup sounds
  soundAssets = {
    theme: sounds["sounds/theme.mp3"],
    crash: sounds["sounds/crash.mp3"],
    up: sounds["sounds/up.mp3"],
    gameOver: sounds["sounds/gameOver.mp3"]
  }
  soundAssets.theme.loop = true;
  soundAssets.up.volume = 0.7;

  app.stage.interactive = true;
  game = new Game();
  app.stage.addChild(game);
  gameLoop();
  app.ticker.add(delta => gameLoop(delta));
}

var ticker = 0;

function gameLoop(delta) {
  ticker = delta;
  game.update();
}

// GLOBAL FUNCTIONS
// gives a random int
function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// handles collision between column and player
function collision(column,playerBox) {
  var hit = false;
  column.centerx = column.getGlobalPosition().x + column.width/2;
  column.centery = column.getGlobalPosition().y + column.height/2;
  playerBox.centerx = playerBox.getGlobalPosition().x;
  playerBox.centery = playerBox.getGlobalPosition().y;

  column.halfHeight = column.height/2;
  column.halfWidth = column.width/2;
  playerBox.halfHeight = playerBox.height/2;
  playerBox.halfWidth = playerBox.width/2;

  // calculate the distance between the two objects
  let dx = Math.abs(column.centerx - playerBox.centerx);
  let dy = Math.abs(column.centery - playerBox.centery);

  if(dx < Math.abs(column.halfWidth + playerBox.halfWidth)) {
    if(dy < Math.abs(column.halfHeight + playerBox.halfHeight)) {
      hit = true;
    }
  }

  return hit;
}

function loadFont() {
  window.WebFontConfig = { google: { families: ['Fredoka+One'] }, active: function() { fontLoaded = true; loadCheck("font")} };
  (function() {
      var wf = document.createElement('script');
      wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
          '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
  })();
}

function loadPixiAssets() {
  // load images
  loader
    .add("assets/playButton.png")
    .add("assets/column.png")
    .add("assets/flyingPixie.png")
    .add([WorldAssets.img, WorldAssets.atlas])
    .load(function() {
      pixiLoaded = true;
      loadCheck("assets");
    });
}

function loadSounds() {
  sounds.load([
      "sounds/theme.mp3",
      "sounds/crash.mp3",
      "sounds/up.mp3",
      "sounds/gameOver.mp3"
  ]);
  sounds.whenLoaded = function() {
    soundsLoaded = true;
    loadCheck("sound")
  }
}
