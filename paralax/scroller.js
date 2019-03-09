function Scroller() {
  this.viewportX = 0;

  this.backdrop = new Backdrop();
  this.far = new Far();

  this.mid = new Mid();
  app.stage.addChild(this.mid);
  
  this.front = new Front();
}

Scroller.prototype.setViewportX = function(viewportX) {
  this.viewportX = viewportX;
  this.far.setViewportX(viewportX);
  this.mid.setViewportX(viewportX);
  this.front.setViewportX(viewportX);
  this.backdrop.setViewportX(viewportX);
};

Scroller.prototype.getViewportX = function() {
  return this.viewportX;
};

Scroller.prototype.moveViewportXBy = function(units) {
  var newViewportX = this.viewportX + units;
  this.setViewportX(newViewportX);
};
