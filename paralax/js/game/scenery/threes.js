function Threes(speed) {
  this.viewportX = 0;
  this.scrollSpeed = speed;
  this.lastTileIndex = 0;
  this.spriteList = ["02_tree_1.png","02_tree_2.png"];
  this.distance = 500;

  PIXI.Container.call(this);
  this.setup(10);
}

Threes.prototype = Object.create(PIXI.Container.prototype);

Threes.prototype.setup = function(amount) {
  for(var i = 0; i<amount; i++) {
    this.addChild(this.newSprite());
    this.lastTileIndex++;
  }
}

Threes.prototype.newSprite = function(amount) {
  let index = randomInt(0,this.spriteList.length-1);
  let sprite = new Sprite(resources[WorldAssets.atlas].textures[this.spriteList[index]]);
  sprite.position.y = Height - sprite.height;
  // set y position to be after the last sprite at a semi-random position
  sprite.position.x = (this.lastTileIndex * this.distance) + randomInt(0,this.distance/2);
  return sprite
}

Threes.prototype.setViewportX = function(newViewportX) {
  this.viewportX = newViewportX;
}

Threes.prototype.update = function() {
  this.position.x = -this.viewportX * this.scrollSpeed;

  var firstChild = this.children[0];
  if(firstChild.getGlobalPosition().x < -firstChild.width) {
    this.removeChild(firstChild);
    this.addChild(this.newSprite());
    this.lastTileIndex++;
  }
}
