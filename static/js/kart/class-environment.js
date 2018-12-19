//THIS IS THE ENVIRONMENT CLASS, IT TAKES CARE OF GIVING A FLAT FLOOR TO THE LEVEL
// ! MAYBE IT SHOULD ALSO TAKE CARE OF BUILDING THE LEVEL IN THE FUTURE !

// ENVIRONMENT OBJECT CLASS (BACKDROP) - - - - - - - - - - - - - - - - - - - - -
class environment {
  constructor() {
    this.textureMult = worldScale/tileScale;
    this.tileScaled = tileScale;
    this.length = mapTexture.height;
    this.width = mapTexture.width;
    this.textureSample = loadImage(pathToTextures + "/world/floor.png");
  }

  addToTexture(x,y,itemTexture) {
    var nx = x*this.tileScaled;
    var ny = y*this.tileScaled;
    mapTexture.copy(itemTexture,0,0,50,50,nx,ny,this.tileScaled,this.tileScaled);
  }

  draw(tex) {
    push();
    translate(((mapTexture.height*this.textureMult)-worldScale)/2,((mapTexture.height*this.textureMult)-worldScale)/2);
    texture(tex);
    plane(this.width*this.textureMult,this.length*this.textureMult);
    //console.log(this.width)
    pop();
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

  drawBushes(cabHeading,x,y) {
    if(this.clipping(cabHeading, x*100,y*100) == true) {
      push();
      translate(x*100,y*100,20);
      rotateX(-PI/2);
      rotateY(-cab.alpha);
      fill(0,0,0,0);
      texture(bushTexture);
      plane(90,45);
      pop();
    }
  }

}
