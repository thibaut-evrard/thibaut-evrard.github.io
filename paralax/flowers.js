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
  var distanceTravelled = newViewportX - this.viewportX;
  this.viewportX = newViewportX;
  this.position.x -= (distanceTravelled * this.speed);
}

Flowers.prototype.update = function() {
  for(var i=0; i<this.children.length; i++) {
    let sprite = this.children[i];
    if(sprite.getGlobalPosition().x < -sprite.width) {
      this.removeChildAt(i);
      this.createSprites(1);
    }
  }
}
