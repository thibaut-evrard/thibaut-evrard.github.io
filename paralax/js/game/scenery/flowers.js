function Flowers(speed) {
  this.viewportX = 0;
  this.amount = 20;
  this.speed = speed;
  this.spriteIndex = 0;
  this.spriteList = [
    "01_hanging_flower1.png",
    "01_hanging_flower2.png",
    "01_hanging_flower3.png"];
  this.distance = 100;
  this.offsetY = -150;

  PIXI.Container.call(this,);
  this.createSprites(this.amount);
}

Flowers.prototype = Object.create(PIXI.Container.prototype);

Flowers.prototype.createSprites = function(amount) {
  for(var i=0; i<amount; i++) {
    let sprite = this.newSprite(this.spriteIndex);
    this.addChild(sprite);
    this.spriteIndex++;
  }
}

Flowers.prototype.newSprite =  function(index) {
  let sprite = this.randomSprite(this.spriteList);
  sprite.position.y = randomInt(0,this.offsetY);
  sprite.position.x = (index * this.distance) + randomInt(0,this.distance);
  return sprite;
}

Flowers.prototype.randomSprite = function() {
  let index = randomInt(0,this.spriteList.length);
  sprite = new Sprite(resources[WorldAssets.atlas].textures[this.spriteList[index]]);
  return sprite;
}

Flowers.prototype.setViewportX = function(newViewportX) {
  this.viewportX = newViewportX;
}

Flowers.prototype.update = function(newViewportX) {
  this.position.x = -this.viewportX * this.speed;

  for(var i=0; i<this.children.length; i++) {
    let sprite = this.children[i];
    if(sprite.getGlobalPosition().x < -sprite.width) {
      this.removeChildAt(i);
      this.createSprites(1);
    }
  }
}

function Flowers(speed) {
  this.viewportX = 0;
  this.scrollSpeed = speed;
  this.lastTileIndex = 0;
  this.spriteList = [
    "01_hanging_flower1.png",
    "01_hanging_flower2.png",
    "01_hanging_flower3.png"];
  this.distance = 100;
  this.offsetY = -150;

  PIXI.Container.call(this);
  this.setup(20);
}

Flowers.prototype = Object.create(PIXI.Container.prototype);

Flowers.prototype.setup = function(amount) {
  for(var i = 0; i<amount; i++) {
    this.addChild(this.newSprite());
    this.lastTileIndex++;
  }
}

Flowers.prototype.newSprite = function(amount) {
  let index = randomInt(0,this.spriteList.length-1);
  let sprite = new Sprite(resources[WorldAssets.atlas].textures[this.spriteList[index]]);
  sprite.position.y = randomInt(0,this.offsetY);
  // set y position to be after the last sprite at a semi-random position
  sprite.position.x = (this.lastTileIndex * this.distance) + randomInt(0,this.distance/2);
  return sprite
}

Flowers.prototype.setViewportX = function(newViewportX) {
  this.viewportX = newViewportX;
}

Flowers.prototype.update = function() {
  this.position.x = -this.viewportX * this.scrollSpeed;

  var firstChild = this.children[0];
  if(firstChild.getGlobalPosition().x < -firstChild.width) {
    this.removeChild(firstChild);
    this.addChild(this.newSprite());
    this.lastTileIndex++;
  }
}
