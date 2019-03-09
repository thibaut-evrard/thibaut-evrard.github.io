function Mid() {
  this.speed = 3;
  this.viewportX = 0;

  PIXI.Container.call(this,);

  this.threes = new Threes(2.8);
  this.addChild(this.threes);

  this.flowers = new Flowers(2.8);
  this.addChild(this.flowers);

  this.ceiling = new ScrollTile("02_front_canopy.png",this.speed);
  this.ceiling.position.y = 30;
  this.addChild(this.ceiling);

  this.ground = new ScrollTile("03_rear_silhouette.png",this.speed);
  this.ground.position.y = Height - this.ground.texture.height - 90;
  this.addChild(this.ground);
}

Mid.prototype = Object.create(PIXI.Container.prototype);

Mid.prototype.setViewportX = function(viewportX) {
  this.children.forEach(function(sprite,index) {
    sprite.setViewportX(viewportX);
  });

  this.threes.update();

  this.flowers.update();
}
