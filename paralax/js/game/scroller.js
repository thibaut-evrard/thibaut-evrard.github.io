function Scroller() {
  this.viewportX = 0;
}

Scroller.prototype.getViewportX = function() {
  return this.viewportX;
};

Scroller .prototype.moveViewportXBy = function(units) {
  let newViewportX = this.viewportX + units;
  this.viewportX = newViewportX;
};
