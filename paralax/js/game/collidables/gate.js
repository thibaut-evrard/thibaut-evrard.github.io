function Gate() {
  PIXI.Container.call(this,);

  this.passed  = false;
  this.texture = resources["assets/column.png"].texture;
  this.createGate(300,100);
}

Gate.prototype = Object.create(PIXI.Container.prototype);

// main function, creates a new gate
Gate.prototype.createGate = function(openingSize,width) {
  // setup the position of the gate opening
  var opening = this.randomOpening(openingSize);

  // create column and add it to the gate
  this.topColumn = this.column( 0, 0, width, opening.top );
  this.addChild(this.topColumn);

  // create column and add it to the gate
  this.bottomColumn = this.column( 0, opening.bottom, width, Height - opening.bottom );
  this.addChild(this.bottomColumn);
}

// returns the gate opening object
Gate.prototype.randomOpening = function(openingSize) {
  opening = {};
  opening.halfSize = openingSize/2;
  opening.centerY = randomInt(opening.halfSize, Height-opening.halfSize), // the opening should stay withing the height of the canvas
  opening.top = opening.centerY - opening.halfSize,
  opening.bottom = opening.centerY + opening.halfSize

  return opening;
}

// returns a column sprite
Gate.prototype.column = function(x,y,w,h) {
  let column = new Sprite(this.texture);
  column.width = w;
  column.height = h;
  column.position.set(x,y);
  return column;
}

// checks the collision with player
Gate.prototype.collides = function(player) {
  if(collision(this.topColumn, player)) { return true; }
  else if(collision(this.bottomColumn, player)) { return true; }
  else { return false; }
}
