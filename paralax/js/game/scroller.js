function Scroller() {
  this.viewportX = 0;
}

// returns the viewport position
Scroller.prototype.getViewportX = function() {
  return this.viewportX;
};

// increase the viewport position
Scroller.prototype.moveViewportXBy = function(units) {
  let newViewportX = this.viewportX + units;
  this.viewportX = newViewportX;
};
