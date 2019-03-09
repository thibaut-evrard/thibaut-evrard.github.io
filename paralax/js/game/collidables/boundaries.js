function Boundaries() {
  this.yCeiling = -20;
  this.yGround = Height;
}

Boundaries.prototype.collides = function(playerHitbox) {
  var playerTop = playerHitbox.getGlobalPosition().y;
  var playerBottom = playerHitbox.getGlobalPosition().y + playerHitbox.height;
  if(this.yCeiling > playerTop || this.yGround < playerBottom) {
    return true;
  }
  else return false;
}
