// creates the texture of the floor

// ENVIRONMENT OBJECT CLASS (BACKDROP) - - - - - - - - - - - - - - - - - - - - -
class environment {
  constructor() {
    // var worldScale = 100;
    // var tileScale = 3;
    this.textureMult = worldScale/tileScale;
    this.tileScaled = tileScale;
    this.tileDefault = 3;
  }

  // add texture to the MPT object
  addToTexture(x,y,itemTexture) {
    var tileX = Math.floor(x/10);//*this.tileScaled;
    var tileY = Math.floor(y/10);
    var nx = (x%10)*this.tileScaled;
    var ny = (y%10)*this.tileScaled;
    mpt[tileX][tileY].original.copy(itemTexture,0,0,50,50,nx,ny,this.tileScaled,this.tileScaled);
  }

  // draw the MPT texture
  draw() {
    push();
    translate(450,450);
    for(var x=0; x<mpt.length; x++) {
      for(var y=0; y<mpt[0].length; y++) {
        push();
        var tile = mpt[x][y];
        translate((tile.x),(tile.y));
        texture(tile.original);
        plane(tile.size,tile.size);
        pop();
      }
    }
    pop();
  }
}
