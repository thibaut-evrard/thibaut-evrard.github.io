// takes care of all the optimisation of the environment relative to the kart

class optimisation {
  constructor() {
    this.tiles = [];
    this.originalDefinition = 24;
    this.compressedDefinition = 1;
    this.matrixSize = 10;

    this.worldScale = 100;

    this.objs3d = {
      walls: [],
      volumeTex: [],
    };
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
          optimised: true,
        }
        //obj.original.id(x + 'a' + y);
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
    this.tiles[tileX][tileY].original.copy(tex,0,0,tex.width,tex.height,nx,ny,this.originalDefinition,this.originalDefinition);
  }
  generateCompressedTilesTex(){
    for(var x=0; x<this.tiles.length; x++) {
      for(var y=0; y<this.tiles[0].length; y++) {
        var tex = createGraphics(this.matrixSize*this.compressedDefinition,this.matrixSize*this.compressedDefinition);
        tex.id(x+'b'+y);
        tex.image(this.tiles[x][y].original,0,0,tex.width,tex.height);
        this.tiles[x][y].compressed = tex;
      }
    }
  }
  drawCompressedFloorTexture() {
    push();
    translate(450,450);
    for(var x=0; x<this.tiles.length; x++) {
      for(var y=0; y<this.tiles[0].length; y++) {
        push();
        var tile = this.tiles[x][y];
        translate((tile.x),(tile.y));
        if(tile.optimised == true) texture(tile.original);
        if(tile.optimised == false) texture(tile.compressed);
        //console.log("car: "car.pos.x + "tiles: " tiles)
        plane(tile.size,tile.size);
        pop();
      }
    }
    pop();
  }

  // 3D OBJECTS METHODS
  addObjectToBox(x,y,entity) {
    var compressedTex = createGraphics(this.originalDefinition,this.originalDefinition);
    compressedTex.id(x+'c'+y);
    compressedTex.image(entity.tex,0,0,compressedTex.width,compressedTex.height);

    var obj = {
      name: entity.name,
      x: x,
      y: y,
      scale: entity.scale,
      tex: compressedTex,
      tex3d: entity.tex3d,
      type: entity.type,
      visible: true,
    }
    if(entity.type == "wall") { this.objs3d.walls.push(obj); }
    if(entity.type == "volumeTex") {
      obj.rotation = random(2*PI);
      this.objs3d.volumeTex.push(obj);
    }
  }
  drawCompressedObjs3d() {
    // draw the walls first
    for(var i=0; i<this.objs3d.walls.length; i++) {
      if(this.objs3d.walls[i].visible == true) this.drawObj3d(this.objs3d.walls[i]);
    }
    // then draw the volumeTex
    for(var i=0; i<this.objs3d.volumeTex.length; i++) {
      if(this.objs3d.volumeTex[i].visible == true) this.drawObj3d(this.objs3d.volumeTex[i]);
    }
  }
  drawObj3d(entity) {
    push();
      translate(entity.x*this.worldScale,entity.y*this.worldScale);
      texture(entity.tex);
      translate(0,0,(entity.scale.z*this.worldScale)/2);
      if(entity.type == "wall") this.drawWall(entity);
      if(entity.type == "volumeTex") this.drawVolume(entity);
    pop();
  }
  drawWall(entity) { box(entity.scale.x*this.worldScale, entity.scale.y*this.worldScale, entity.scale.z*this.worldScale); }
  drawVolume(entity) {
    var w = entity.tex3d.width*4;
    var h = entity.tex3d.height*4;
    translate(0,0,h/2);
    texture(entity.tex3d);
    rotateX(-PI/2);
    rotateY(entity.rotation);//entity.rotation);
    plane(w, h);
  }

  clipping(posX, posY, distMax, distMin) {
    var heading = car.heading;
    var result = true;
    // ANGLE CLIPPING
    var offsetX = car.pos.x - posX;
    var offsetY = car.pos.y - posY;
    var directionBlock = createVector(offsetX,offsetY);
    var angle = heading.angleBetween(directionBlock);
    if(abs(angle) > PI/2) result = false; // clipping from angle
    if(directionBlock.mag() >= distMax) result = false; // clipping from distance
    if(directionBlock.mag() <= distMin) result = true; // if the brick is super close, display it anyway

    return result;
  }
  async updateOptimisationState() {
    // define what 3D objects are visible
    for(var i=0; i<this.objs3d.walls.length; i++) this.objs3d.walls[i].visible = this.clipping(this.objs3d.walls[i].x*this.worldScale,this.objs3d.walls[i].y*this.worldScale,3000,300);
    for(var i=0; i<this.objs3d.volumeTex.length; i++) this.objs3d.volumeTex[i].visible = this.clipping(this.objs3d.volumeTex[i].x*this.worldScale,this.objs3d.volumeTex[i].y*this.worldScale,1000,300);

    var pos = createVector(Math.floor(car.pos.x/100),Math.floor(car.pos.y/100));
    //sort the transparent textured objects from distance to the car
    this.objs3d.volumeTex.sort(function(a,b) {
      //console.log(a);
      var da = dist(pos.x,pos.y,a.x,a.y);
      var db = dist(pos.x,pos.y,b.x,b.y);
      return db - da;
    });

    // define the deffinition of each tile
    for(var x=0; x<this.tiles.length; x++) {
      for(var y=0; y<this.tiles[0].length; y++) {
        this.tiles[x][y].optimised = this.clipping(this.tiles[x][y].x,this.tiles[x][y].y,2000,1200);
      }
    }
  }
}
