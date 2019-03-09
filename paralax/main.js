//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Width = 1200,
    Height = 700;

//Create a Pixi Application object
let app = new Application({
    width: Width,
    height: Height,
    antialias: true,
    transparent: false,
    resolution: 1
  }
);

document.body.appendChild(app.view);

let WorldAssets = {
      img: "assets/WorldAssets.png",
      atlas: "assets/WorldAssets.json"
    };

// load images
loader
  .add([WorldAssets.img, WorldAssets.atlas])
  .load(setup);

function setup() {
  console.log("loadfinished");

  scroller = new Scroller();
  // console.log(scroller.getViewportX);
  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  scroller.moveViewportXBy(1);
}



function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
