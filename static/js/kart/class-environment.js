//THIS IS THE ENVIRONMENT CLASS, IT TAKES CARE OF GIVING A FLAT FLOOR TO THE LEVEL
// ! MAYBE IT SHOULD ALSO TAKE CARE OF BUILDING THE LEVEL IN THE FUTURE !

// ENVIRONMENT OBJECT CLASS (BACKDROP) - - - - - - - - - - - - - - - - - - - - -
class environment {
  constructor() {
    // var worldScale = 100;
    // var tileScale = 3;
    this.textureMult = worldScale/tileScale;
    this.tileScaled = tileScale;
    this.tileDefault = 3;
    this.length = mapTexture.height;
    this.width = mapTexture.width;
    // this.textureSample = loadImage(pathToTextures + "/world/floor.png");
  }

  setup() {

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

  addToTexture(x,y,itemTexture) {
    var tileX = Math.floor(x/10);//*this.tileScaled;
    var tileY = Math.floor(y/10);
    var nx = (x%10)*this.tileScaled;
    var ny = (y%10)*this.tileScaled;
    //console.log("x= " + x + "nx = " + nx);
    mpt[tileX][tileY].original.copy(itemTexture,0,0,50,50,nx,ny,this.tileScaled,this.tileScaled);
    //mapTexture.copy(itemTexture,0,0,50,50,nx,ny,this.tileScaled,this.tileScaled);
  }

  draw() {
    push();
    translate(450,450);
    for(var x=0; x<mpt.length; x++) {
      for(var y=0; y<mpt[0].length; y++) {
        push();
        var tile = mpt[x][y];
        translate((tile.x),(tile.y));
        texture(tile.compressed);
        plane(tile.size,tile.size);
        //console.log(this.width)
        pop();
      }
    }
    pop();
    //updateTextures();
  }

  clipping(cabHeading, x,y) {
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

  // drawBushes(cabHeading,x,y) {
  //   if(this.clipping(cabHeading, x*100,y*100) == true) {
  //     push();
  //     translate(x*100,y*100,20);
  //     rotateX(-PI/2);
  //     rotateY(-cab.alpha);
  //     fill(0,0,0,0);
  //     texture(bushTexture);
  //     plane(90,45);
  //     pop();
  //   }
  // }

}
