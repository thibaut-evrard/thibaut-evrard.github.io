function Far() {
  this.speed = 2.5;
  this.viewportX = 0;
  this.yOffset = 100;

  this.ceiling = new ScrollTile("03_rear_canopy.png",this.speed);
  this.ceiling.position.y = 50;
  app.stage.addChild(this.ceiling);
  // var threeList = ["02_tree_1.png","02_tree_2.png"];
  // var frequency = 0.2;
}

Far.prototype.setViewportX = function(viewportX) {
  this.ceiling.setViewportX(viewportX);
}
