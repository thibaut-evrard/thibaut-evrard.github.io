function Gate() {
  PIXI.Container.call(this,);

  this.passed  = false;
  this.texture = resources["assets/column.png"].texture;
  this.createGate(300,100);
}

Gate.prototype = Object.create(PIXI.Container.prototype);

// creates the columns and adds them to the container
Gate.prototype.createGate = function(openingSize,width) {
  // setup the position of the gate opening
  var opening = this.randomOpening(openingSize);

  // create columns
  this.topColumn = this.createColumn( 0, 0, width, opening.top );
  this.bottomColumn = this.createColumn( 0, opening.bottom, width, Height - opening.bottom );

  // add columns to container
  this.addChild(this.bottomColumn);
  this.addChild(this.topColumn);
}

// returns the info about the gap between columns
Gate.prototype.randomOpening = function(openingSize) {
  opening = {};
  opening.halfSize = openingSize/2;
  opening.centerY = randomInt(opening.halfSize, Height-opening.halfSize), // the opening should stay withing the height of the canvas
  opening.top = opening.centerY - opening.halfSize,
  opening.bottom = opening.centerY + opening.halfSize

  return opening;
}

// returns a column sprite
Gate.prototype.createColumn = function(x,y,w,h) {
  let column = new Sprite(this.texture);
  column.width = w;
  column.height = h;
  column.position.set(x,y);
  return column;
}

// checks the collision with player
Gate.prototype.collides = function(playerBox) {
  if(this.collision(this.topColumn, playerBox)) return true;
  else if(this.collision(this.bottomColumn, playerBox)) return true;
  else return false;
}

// returns true if the object collides the player
Gate.prototype.collision = function(column,playerBox) {
  var hit = false;
  column.centerx = column.getGlobalPosition().x + column.width/2;
  column.centery = column.getGlobalPosition().y + column.height/2;
  playerBox.centerx = playerBox.getGlobalPosition().x;
  playerBox.centery = playerBox.getGlobalPosition().y;

  column.halfHeight = column.height/2;
  column.halfWidth = column.width/2;
  playerBox.halfHeight = playerBox.height/2;
  playerBox.halfWidth = playerBox.width/2;

  // calculate the distance between the two objects
  let dx = Math.abs(column.centerx - playerBox.centerx);
  let dy = Math.abs(column.centery - playerBox.centery);

  if(dx < Math.abs(column.halfWidth + playerBox.halfWidth)) {
    if(dy < Math.abs(column.halfHeight + playerBox.halfHeight)) {
      hit = true;
    }
  }

  return hit;
}
