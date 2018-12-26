// takes care of all the optimisation of the environment relative to the kart

class optimisation {
  constructor() {

  }

  // add texture to the MPT object
  addToMap2d(x,y,itemTexture) {
    var tileX = Math.floor(x/10);//*this.tileScaled;
    var tileY = Math.floor(y/10);
    var nx = (x%10)*this.tileTextureDefinition;
    var ny = (y%10)*this.tileTextureDefinition;
    // add the texture to the 2D texture tiles map
    maps.tex2d[tileX][tileY].original.copy(itemTexture,0,0,50,50,nx,ny,this.tileScaled,this.tileScaled);
  }

  initTex2d() {
    for(var x=0; x<imgWidth+10; x+=10) {
      var row = [];
      for(var y=0; y<imgHeight+10; y+=10) {
        var tiling = 10;
        var obj = {
          original: createGraphics(tiling*tileScale,tiling*tileScale),
          compressed: 0,
          x: x*worldScale,
          y: y*worldScale,
          size: tiling * worldScale,
          optimized: true,
        }
        row.push(obj);
      }
      maps.tex2d.push(row);
    }
  }

  // handles the clipping of the physical 3D objects
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

  // handles the compression of the different texture tiles
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

  drawTex2d(tiles) {
    push();
    translate(450,450);
    for(var x=0; x<tiles.length; x++) {
      for(var y=0; y<tiles[0].length; y++) {
        push();
        var tile = tiles[x][y];
        translate((tile.x),(tile.y));
        texture(tile.original);
        plane(tile.size,tile.size);
        pop();
      }
    }
    pop();
  }

  // UNUSED FOR NOW
  // creates an instace of compressed tile out of the normal one
  setupCompressedTiles(factor) {
    for(var x=0; x<mpt.length; x++) {
      for(var y=0; y<mpt[0].length; y++) {
        var defaultScale = factor*10
        mpt[x][y].compressed = createGraphics(defaultScale,defaultScale);
        mpt[x][y].compressed.image(mpt[x][y].original,0,0,defaultScale,defaultScale);
      }
    }
  }

}
