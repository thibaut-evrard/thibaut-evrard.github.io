function Scenery() {
  PIXI.Container.call(this,);

  let backdrop = new ScrollTile("05_far_BG.jpg",0.2);
  backdrop.position.y = 100;
  this.addChild(backdrop);

  let rearCanopy = new ScrollTile("03_rear_canopy.png",0.5);
  rearCanopy.position.y = 50;
  this.addChild(rearCanopy);

  let threes = new Threes(0.55);
  threes.position.y = -100;
  this.addChild(threes);

  let flowers = new Flowers(0.56);
  flowers.position.y = 0;
  this.addChild(flowers);

  let rearSilhouette = new ScrollTile("03_rear_silhouette.png",0.6);
  rearSilhouette.position.y = Height - rearSilhouette.texture.height - 50;
  this.addChild(rearSilhouette);

  let frontCanopy = new ScrollTile("02_front_canopy.png",0.7);
  frontCanopy.position.y = 20;
  this.addChild(frontCanopy);

  let frontSilhouette = new ScrollTile("01_front_silhouette.png",0.8);
  frontSilhouette.position.y = Height - frontSilhouette.texture.height;
  this.addChild(frontSilhouette);

  let roofLeaves = new ScrollTile("00_roof_leaves.png",0.8);
  roofLeaves.position.y = 0;
  this.addChild(roofLeaves);
}

Scenery.prototype = Object.create(PIXI.Container.prototype);

Scenery.prototype.setViewportX = function(viewportX) {
  this.children.forEach(function(child) {
    child.setViewportX(viewportX);
  });
};

Scenery.prototype.update = function() {
  this.children.forEach(function(child) {
    child.update();
  });
};
