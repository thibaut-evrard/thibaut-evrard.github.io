function Collidables() {
  PIXI.Container.call(this,);

  this.gates = new Gates();
  this.addChild(this.gates);
  this.boundaries = new Boundaries();

  this.initialised = false;
}

Collidables.prototype = Object.create(PIXI.Container.prototype);

Collidables.prototype.setViewportX = function(newViewportX) {
  this.gates.setViewportX(newViewportX);
}

Collidables.prototype.init = function(viewportX) {
  this.gates.setup(viewportX);
  this.initialised = true;
}

Collidables.prototype.update = function() {
  this.gates.update();
}

Collidables.prototype.collides = function(playerBox) {
  if(this.gates.collides(playerBox) || this.boundaries.collides(playerBox)) return true;
  else return false;
}
