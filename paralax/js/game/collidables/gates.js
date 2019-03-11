function Gates() {
  this.viewportX = 0;
  this.speed = 0;

  PIXI.Container.call(this,);

  this.currentGateXpos = 0; // where to put the next gate
  this.gateOffset = 500;
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
  this.viewportX = viewportX;
  // creates the point where the first gate will be created
  this.currentGateXpos = this.viewportX + Width;
  for(var i=0; i<5; i++) {
    var gate = this.createGate();
    this.addChild(gate);
  }
}

// returns gate and sets up position for the next gate
Gates.prototype.createGate = function() {
  let gate = new Gate();
  gate.position.x = this.currentGateXpos;
  this.currentGateXpos += this.gateOffset;
  return gate;
}

// returns true if the player collides a gate
Gates.prototype.collides = function(playerBox) {
  for(gate of this.children) {
    if(gate.collides(playerBox)) return true;
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

// updates the position, delete useless gate and add new one if needed
Gates.prototype.update = function() {
  this.position.x = -this.viewportX;
  // if the furthest gate left goes out of screen
  if(this.isOut(this.children[0])) {
    this.removeChildAt(0);
    var gate = this.createGate();
    this.addChild(gate);
  }
}

// update scroll variable
Gates.prototype.setViewportX = function(newViewportX) {
  this.viewportX = newViewportX;
}

// checks if gate is out of screen on the left side
Gates.prototype.isOut = function(gate) {
  if(gate.getGlobalPosition().x < -gate.width) return true;
  else return false;
}
