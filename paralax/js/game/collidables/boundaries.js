function Boundaries() {
  this.yCeiling = -20;
  this.yGround = Height;
}

// checks collision with player
Boundaries.prototype.collides = function(playerBox) {
  var playerTop = playerBox.getGlobalPosition().y - playerBox.height/2;
  var playerBottom = playerBox.getGlobalPosition().y + playerBox.height/2;
  if(this.yCeiling > playerTop || this.yGround < playerBottom) return true;
  else return false;
}
