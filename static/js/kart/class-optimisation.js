// takes care of all the optimisation of the environment relative to the kart

class optimisation {
  constructor() {
    this.tiles = [];
    this.originalDefinition = 2;
    this.matrixSize = 10;

    this.worldScale = 100;

    this.objs3d = [];
  }

  // 2D TEXTURES METHODS
  createOptimisedCanvas() {
    for(var x=0; x<imgWidth+this.matrixSize; x+=this.matrixSize) {
      var row = [];
      for(var y=0; y<imgHeight+this.matrixSize; y+=this.matrixSize) {
        var obj = {
          original: createGraphics(this.matrixSize*this.originalDefinition,this.matrixSize*this.originalDefinition),
          compressed: 0,
          x: x*worldScale,
          y: y*worldScale,
          size: this.matrixSize * worldScale,
          optimized: true,
        }
        row.push(obj);
      }
      this.tiles.push(row);
    }
  }
  addTextureToTiles(x,y,tex) {
    var tileX = Math.floor(x/10);//*this.tileScaled;
    var tileY = Math.floor(y/10);
    var nx = (x%10)*this.originalDefinition;
    var ny = (y%10)*this.originalDefinition;
    // add the texture to the 2D texture tiles map
    this.tiles[tileX][tileY].original.copy(tex,0,0,50,50,nx,ny,this.originalDefinition,this.originalDefinition);
  }
  drawCompressedFloorTexture() {
    push();
    translate(450,450);
    for(var x=0; x<this.tiles.length; x++) {
      for(var y=0; y<this.tiles[0].length; y++) {
        push();
        var tile = this.tiles[x][y];
        translate((tile.x),(tile.y));
        texture(tile.original);
        plane(tile.size,tile.size);
        pop();
      }
    }
    pop();
  }

  // 3D OBJECTS METHODS
  addObjectToBox(x,y,entity) {
    var compressedTex = createGraphics(this.originalDefinition,this.originalDefinition);
    compressedTex.image(entity.tex,0,0,compressedTex.width,compressedTex.height);

    var obj = {
      x: x,
      y: y,
      scale: entity.scale,
      tex: compressedTex,
      type: entity.type,
      visible: true,
    }
    this.objs3d.push(obj);
  }
  drawCompressedObjs3d() {
    for(var i=0; i<this.objs3d.length; i++) {
      if(this.objs3d[i].visible == true) this.drawObj3d(this.objs3d[i]);
    }
  }
  drawObj3d(entity) {
    push();
      translate(entity.x*this.worldScale,entity.y*this.worldScale);
      texture(entity.tex);
      translate(0,0,(entity.scale.z*this.worldScale)/2);
      box(entity.scale.x*this.worldScale, entity.scale.y*this.worldScale, entity.scale.z*this.worldScale);
    pop();
  }

  clipping(entity) {
    var heading = car.heading;
    var result = true;
    // ANGLE CLIPPING
    var offsetX = car.pos.x - entity.x*this.worldScale;
    var offsetY = car.pos.y - entity.y*this.worldScale;
    var directionBlock = createVector(offsetX,offsetY);
    var angle = heading.angleBetween(directionBlock);
    if(abs(angle) > PI/2) result = false; // clipping from angle
    if(directionBlock.mag() >= 2500) result = false; // clipping from distance
    if(directionBlock.mag() <= 300) result = true; // if the brick is super close, display it anyway

    return result;
  }
  async updateObjsClipping() {
    for(var i=0; i<this.objs3d.length; i++) this.objs3d[i].visible = this.clipping(this.objs3d[i]);
  }
}
