function Bird() {
  this.gravity = 1.5;
  this.jumpForce = 35;
  this.controlable = false;

  PIXI.Sprite.call(this, resources["assets/flyingPixie.png"].texture);
  this.vy = 0;
  this.anchor.set(0.5,0.5);
  this.hitbox = this.hitbox();

  this.playXPos = Width/3;

  this.position.set(-this.width,Height/2); // to reset on setup?
  this.addChild(this.hitbox);
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
  this.position.x = this.playXPos;
  this.vy += this.gravity;
  this.vy *= 0.9;
  this.position.y += this.vy;
}

// handles the animated rotation of the bird
Bird.prototype.animate = function() {
  this.hitbox.height = this.height - this.hitbox.tolerance + 15;
  this.hitbox.width = this.height - this.hitbox.tolerance - 5;
  this.rotation = this.vy/40;
  this.hitbox.rotation = -this.rotation;
}

// handles the bird death animation
Bird.prototype.die = function() {
  this.gravity = 1;
  this.rotation += -0.09;
}

// makes the bird go up
Bird.prototype.jump = function() {
  this.vy -= this.jumpForce;
}

// slide the bird from the left of the screen to it's play position
Bird.prototype.slideIn = function(time) {
  var p0x = -this.width;
  var p1x = this.playXPos;
  var step = (p1x - p0x) / (time/20);
  var that = this;
  var f = setInterval(function() {
    that.position.x += step;
    if(that.position.x > Width/3) clearInterval(f);
  },20)
}

//translates tap/space event into bird action
Bird.prototype.control = function() {
  if(this.controlable) {
    soundAssets.up.play();
    this.jump();
  }
}

Bird.prototype.resize = function() {
  this.playXPos = Width/3;
}
