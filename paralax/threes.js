function Threes(speed) {
  this.viewportX = 0;
  this.amount = 10;
  this.speed = speed;
  this.spriteIndex = 0;
  this.spriteList = ["02_tree_1.png","02_tree_2.png"];
  this.distance = 500;
  this.offsetY = 150;

  PIXI.Container.call(this,);
  this.createSprites(this.amount);
}

Threes.prototype = Object.create(PIXI.Container.prototype);

Threes.prototype.createSprites = function(amount) {
  for(var i=0; i<amount; i++) {
    let sprite = this.newSprite(this.spriteIndex);
    this.addChild(sprite);
    this.spriteIndex++;
  }
}

Threes.prototype.newSprite =  function(index) {
  let sprite = this.randomSprite(this.spriteList);
  sprite.position.y = Height - sprite.height - this.offsetY;
  sprite.position.x = (index * this.distance) + randomInt(0,this.distance/2);
  return sprite;
}

Threes.prototype.randomSprite = function() {
  let index = randomInt(0,this.spriteList.length);
  sprite = new Sprite(resources[WorldAssets.atlas].textures[this.spriteList[index]]);
  return sprite;
}

Threes.prototype.setViewportX = function(newViewportX) {
  var distanceTravelled = newViewportX - this.viewportX;
  this.viewportX = newViewportX;
  this.position.x -= (distanceTravelled * this.speed);
}

Threes.prototype.update = function() {
  for(var i=0; i<this.children.length; i++) {
    let sprite = this.children[i];
    if(sprite.getGlobalPosition().x < -sprite.width) {
      this.removeChildAt(i);
      this.createSprites(1);
    }
  }
}
