function Lava(speed) {
  this.scrollSpeed = speed;
  this.frames = this.createAnnimation();

  this.lastTileIndex = 0;
  this.viewportX = 0;

  PIXI.Container.call(this);
  this.setup(10);
}

Lava.prototype = Object.create(PIXI.Container.prototype);

// initiates the lava tiles
Lava.prototype.setup = function(amount) {
  for(var i = 0; i<amount; i++) {
    this.addChild(this.newTile());
    this.lastTileIndex++;
  }
}

Lava.prototype.newTile = function() {
  var tile = new PIXI.extras.AnimatedSprite(this.frames);
  tile.x = (tile.width -1) * this.lastTileIndex;
  tile.y = app.screen.height - tile.height;
  tile.animationSpeed = 0.1;
  tile.play();
  return tile
}

Lava.prototype.update = function() {
  this.position.x = -this.viewportX * this.scrollSpeed;

  // each time a tile disapears on the right of the screen
  // delete it and add a new one to the queue
  var firstChild = this.children[0];
  if(firstChild.getGlobalPosition().x < -firstChild.width) {
    this.removeChild(firstChild);
    this.addChild(this.newTile());
    this.lastTileIndex++;
  }
}

Lava.prototype.setViewportX = function(newViewportX) {
  this.viewportX = newViewportX;
}

Lava.prototype.createAnnimation = function() {
  var frames = [];

  for(var i=1; i<=14; i++) {
    var number;
    if(i<=8) number = i;
    else if(i>8) number = 8-(i-8);
    let path = "lava_slosh_0" + number + ".png";
    let texture = new PIXI.Texture.fromFrame(path);
    frames.push(texture);
  }
  return frames;
}
