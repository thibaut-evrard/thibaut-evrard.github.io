function Front() {
  this.speed = 4;
  this.viewportX = 0;

  this.ceiling = new ScrollTile("00_roof_leaves.png",this.speed);
  this.ceiling.position.y = 0;
  app.stage.addChild(this.ceiling);

  this.ground = new ScrollTile("01_front_silhouette.png",this.speed);
  this.ground.position.y = Height - this.ground.texture.height;
  app.stage.addChild(this.ground);
}

Front.prototype.setViewportX = function(viewportX) {
  this.ceiling.setViewportX(viewportX);
  this.ground.setViewportX(viewportX);
}
