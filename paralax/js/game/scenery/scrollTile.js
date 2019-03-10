function ScrollTile(texturePath,scrollSpeed) {
  this.viewportX = 0;
  this.scrollSpeed = scrollSpeed;

  var texture = resources[WorldAssets.atlas].textures[texturePath];
  var width = Width;
  var height = texture.orig.height;
  PIXI.TilingSprite.call(this, texture, width, height);

  this.tilePosition.set(0,0);
}

ScrollTile.prototype = Object.create(PIXI.TilingSprite.prototype);

ScrollTile.prototype.update = function() {
  this.tilePosition.x = -this.viewportX * this.scrollSpeed;
};

ScrollTile.prototype.setViewportX = function(newViewportX) {
  this.viewportX = newViewportX;
};