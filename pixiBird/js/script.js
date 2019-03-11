// setting up canvas width, height and resolution
var Width =  1200,
    Height = 640,
    resolution = window.devicePixelRatio;

if(document.documentElement.clientHeight < 640) { resolution = window.devicePixelRatio * document.documentElement.clientHeight/640; }

//declaring Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

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

var soundAssets;
var WorldAssets = { img: "assets/WorldAssets.png", atlas: "assets/WorldAssets.json" };

// creating loadCheck variables
var pixiLoaded = false,
    soundsLoaded = false,
    fontLoaded = false;

// loading files for the game
loadFont();
loadPixiAssets();
loadSounds();

// go to setup when sound, assets and font are loaded
function loadCheck(type) {
  console.log(type + " loaded...")
  if(pixiLoaded && soundsLoaded && fontLoaded) {
    console.log("loading finished...");
    setup();
  }
}

// setup the game environment
function setup() {
  // console.log("now setting up the game...")

  // setup sounds
  setupSound();
  game = new Game();
  app.stage.interactive = true;
  app.stage.addChild(game);

  gameLoop();
  app.ticker.add(delta => gameLoop(delta));
}

var ticker = 0;
// game loop
function gameLoop(delta) {
  ticker = delta;
  game.update();
}

// GLOBAL APP FUNCTIONS

// returns a random integer
function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// loads the font
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

// loads the game assets
function loadPixiAssets() {
  // load images
  loader
    .add("assets/playButton.png")
    .add("assets/column.png")
    .add("assets/flyingPixie.png")
    .add("assets/WorldAssets.json")
    .load(function() {
      pixiLoaded = true;
      loadCheck("assets");
    });
}

// load the sound assets
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

// setup the sounds
function setupSound() {
  soundAssets = {
    theme: sounds["sounds/theme.mp3"],
    crash: sounds["sounds/crash.mp3"],
    up: sounds["sounds/up.mp3"],
    gameOver: sounds["sounds/gameOver.mp3"]
  }
  soundAssets.theme.loop = true;
  soundAssets.up.volume = 0.7;
}

function resize() {
  var docH = document.documentElement.clientHeight,
      appH = 640,
      heightEnlarge = docH / appH;

  Width = document.documentElement.clientWidth/heightEnlarge;
  Height = appH;

  resolution = window.devicePixelRatio;
  if(heightEnlarge < 1) { resolution = window.devicePixelRatio * heightEnlarge; }

  app.renderer.resolution = resolution;
  app.renderer.resize(Width,Height);

  if (typeof game !== 'undefined') {
    game.resize();
  }

  app.renderer.view.style.width = document.documentElement.clientWidth + 'px';
  app.renderer.view.style.height = document.documentElement.clientHeight + 'px';
}

window.addEventListener("resize", function(event){
  resize();
});
