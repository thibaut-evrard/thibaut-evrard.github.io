function Backdrop() {
  this.speed = 2;
  this.viewportX = 0;

  this.backdrop = new ScrollTile("05_far_BG.jpg",this.speed);
  this.backdrop.position.y = 90;
  app.stage.addChild(this.backdrop);
}

Backdrop.prototype.setViewportX = function(viewportX) {
  this.backdrop.setViewportX(viewportX);
}
