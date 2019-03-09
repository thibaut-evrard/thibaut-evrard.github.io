function Gates() {
  this.viewportX = 0;
  this.speed = 0;

  PIXI.Container.call(this,);

  this.currentGateXpos = 0; // all children ever created
  this.gateOffset = 500;
  this.gatesPool = [];
  var that = this;
  this.passed = {
    value: 0,
    getValue: function(player) {
      that.updateGatesPassed(player);
      return this.value;
    }
  }
}

Gates.prototype = Object.create(PIXI.Container.prototype);

// setup the gates from the current viewportX
Gates.prototype.setup = function(viewportX) {
  console.log(viewportX);
  this.viewportX = viewportX;
  // creates the point where the first gate will be created
  this.currentGateXpos = this.viewportX + Width;
  // fills up the gatePool object
  for(var i=0; i<5; i++) {
    // crate a new gate and add it to the pool and to the container
    var gate = this.gate();
    this.gatesPool.push(gate);
    this.addChild(gate);
  }
}

// returns gate and sets up position for the next gate
Gates.prototype.gate = function() {
  let gate = new Gate();
  gate.position.x = this.currentGateXpos;
  this.currentGateXpos += this.gateOffset;
  return gate;
}

// returns true if the player collides a gate
Gates.prototype.collides = function(player) {
  for(gate of this.children) {
    if(gate.collides(player)) return true;
  }
  return false;
}

// returns the total number of gates passed by the player
Gates.prototype.updateGatesPassed = function(player) {
  for(gate of this.children) {
    var gateEndX = gate.getGlobalPosition().x + gate.width;
    if(gateEndX < player.position.x && gate.passed == false) {
      gate.passed = true;
      this.passed.value ++;
    }
  }
}

Gates.prototype.update = function() {
  this.position.x = -this.viewportX;
  // if the furthest gate left goes out of screen
  if(this.isOut(this.children[0])) {
    // delete it
    this.removeChildAt(0);
    this.gatesPool.splice(0,1);
    // add a new gate to the pool
    var gate = this.gate();
    this.gatesPool.push(gate);
    this.addChild(gate);
  }
}

Gates.prototype.setViewportX = function(newViewportX) {
  this.viewportX = newViewportX;
}


Gates.prototype.isOut = function(gate) {
  if(gate.getGlobalPosition().x < -gate.width) {
    return true;
  }
  else return false;
}
