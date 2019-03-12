function Scenery() {
  PIXI.Container.call(this);

  let backdrop = new ScrollTile("05_far_BG.jpg",0.4);
  backdrop.position.y = 100;
  this.addChild(backdrop);

  let rearCanopy = new ScrollTile("03_rear_canopy.png",0.5);
  rearCanopy.position.y = 50;
  this.addChild(rearCanopy);

  let trees = new Trees(0.56);
  trees.position.y = -100;
  this.addChild(trees);

  let flowers = new Flowers(0.56);
  flowers.position.y = 0;
  this.addChild(flowers);

  let rearSilhouette = new ScrollTile("03_rear_silhouette.png",0.6);
  rearSilhouette.position.y = Height - rearSilhouette.texture.height - 50;
  this.addChild(rearSilhouette);

  let frontCanopy = new ScrollTile("02_front_canopy.png",0.57);
  frontCanopy.position.y = 20;
  this.addChild(frontCanopy);

  let frontSilhouette = new ScrollTile("01_front_silhouette.png",0.8);
  frontSilhouette.position.y = Height - frontSilhouette.texture.height;
  this.addChild(frontSilhouette);

  let roofLeaves = new ScrollTile("00_roof_leaves.png",0.8);
  roofLeaves.position.y = 0;
  this.addChild(roofLeaves);

  let lava = new Lava(1);
  lava.position.y = 0;
  this.addChild(lava);
}

Scenery.prototype = Object.create(PIXI.Container.prototype);

// gives viewport to each child
Scenery.prototype.setViewportX = function(viewportX) {
  this.children.forEach(function(child) {
    child.setViewportX(viewportX);
  });
};

// update the object position and handles sprite array rotation when applicable
Scenery.prototype.update = function() {
  this.children.forEach(function(child) {
    child.update();
  });
};

Scenery.prototype.resize = function() {
  this.children.forEach(function(child) {
    child.resize();
  });
}
