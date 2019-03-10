function Bird() {
  //this.viewportX = 0;
  this.gravity = 1.5;
  this.jumpForce = 35;
  this.controlable = false;

  PIXI.Sprite.call(this, resources["assets/flyingPixie.png"].texture);
  this.vy = 0;
  this.anchor.set(0.5,0.5);
  this.hitbox = this.hitbox();

  this.position.set(-this.width,Height/2); // to reset on setup?
  this.addChild(this.hitbox);

  var that = this;
}

Bird.prototype = Object.create(PIXI.Sprite.prototype);

// returns the bird's hitbox
Bird.prototype.hitbox = function() {
  hitbox = new PIXI.Graphics();
  // hitbox.beginFill(0x66CCFF);
  hitbox.alpha = 0.3;
  hitbox.tolerance = 20;

  var boxW = this.width - hitbox.tolerance;
  var boxH = this.height - hitbox.tolerance
  hitbox.drawRect(0, 0, boxW, boxH);
  hitbox.pivot.set(boxW/2, boxH/2);

  return hitbox;
}

// updates the bird position
Bird.prototype.update = function() {
  this.vy += this.gravity;
  this.vy *= 0.9;
  this.position.y += this.vy;
}

// handles the bird death annimation
Bird.prototype.die = function() {
  this.gravity = 1;
  this.rotation += -0.09;
}

// makes the bird go up
Bird.prototype.jump = function() {
  this.vy -= this.jumpForce;
}

// UNUSED
Bird.prototype.animate = function() {
  this.hitbox.height = this.height - this.hitbox.tolerance + 15;
  this.hitbox.width = this.height - this.hitbox.tolerance - 5;
  this.rotation = this.vy/40;
  this.hitbox.rotation = -this.rotation;
}

// makes the bird slide in the area at init time
Bird.prototype.slideIn = function(time) {
  var p0x = -this.width;
  var p1x = Width/4;
  var step = (p1x - p0x) / time;
  if(this.position.x < Width/4) this.position.x += step;
}

Bird.prototype.control = function() {
  console.log(this.controlable);
  if(this.controlable) {
    soundAssets.up.play();
    this.jump();
  }
}
