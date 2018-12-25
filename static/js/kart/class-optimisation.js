// takes care of all the optimisation of the environment relative to the kart

class optimisation {
  constructor() {

  }

  setupTiles(factor) {
    for(var x=0; x<mpt.length; x++) {
      for(var y=0; y<mpt[0].length; y++) {
        var defaultScale = factor*10
        mpt[x][y].compressed = createGraphics(defaultScale,defaultScale);
        mpt[x][y].compressed.image(mpt[x][y].original,0,0,defaultScale,defaultScale);
      }
    }
  }

  objectClipping(cabHeading, x,y) {
    var result = true;
    // ANGLE CLIPPING
    var offsetX = cab.pos.x - x;
    var offsetY = cab.pos.y - y;
    var directionBlock = createVector(offsetX,offsetY);
    var angle = cabHeading.angleBetween(directionBlock);
    if(abs(angle) > PI/2) result = false; // clipping from angle
    if(directionBlock.mag() >= 2500) result = false; // clipping from distance
    if(directionBlock.mag() <= 300) result = true; // if the brick is super close, display it anyway
    return result;
  }

  textureClipping(x,y) {
    for(var i=x-2; i<x+3; i++) {
      for(var j=y-2; j<y+3; j++) {
        var grid = mpt.length;
        if(i>0 && j>0 && i<grid && j<grid && mpt[x][y].optimized == true) {
          mpt[x][y].compressed = mpt[x][y].original;
          mpt[x][y].optimized = false;
        }
      }
    }
  }

}
