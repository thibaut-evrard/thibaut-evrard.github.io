class buildCircuit {
  // circuitModel -> interactive -> 3Dtexture -> 3D texture

  constructor(png,scale) {
    this.scale = scale;
    this.minZ = 0;
    this.cTileCompression = 1;
    this.height = 30;

    this.tileTextureDefinition = 3;

    this.circuitPng = png;
    this.clippingDistance = 2000;
  }

  // setting up the different subobjects of the map
  initMiniMap() {
    var height = this.circuitPng.height;
    var width = this.circuitPng.width;
    for(var x=0; x<width; x++) {
      var row = [];
      for(var y=0; y<height; y++) row.push(0);
      miniMap.push(row);
    }
  }


  // scan each of the png file pixels and execute the function buildObject for each one of them
  miniMapFromPng() {
    this.circuitPng.loadPixels();
    for(var y=0; y<this.circuitPng.height; y++) {
      for(var x=0; x<this.circuitPng.width; x++) {
        var pos = (y*this.circuitPng.width + x)*4;
        var r = this.circuitPng.pixels[pos];
        var g = this.circuitPng.pixels[pos+1];
        var b = this.circuitPng.pixels[pos+2];
        this.addObjectToMinimap(r,g,b,x,y);
        optimisation.addTextureToTiles(x,y,miniMap[x][y].tex);
        if(miniMap[x][y].type != "floor") optimisation.addObjectToBox(x,y,miniMap[x][y]);
      }
    }
    optimisation.generateCompressedTilesTex();
  }

  entity(name,tex,type,tex3d) {
    var obj = {
      name: name,
      tex: tex,
      tex3d: tex3d,
      type: type,
      scale: { x:1, y:1, z:0 },
    }
    if(type == "wall") obj.scale.z = 0.3;
    return obj;
  }

  // scans every pixel and builds an object instance out of it
  addObjectToMinimap(r,g,b,x,y) {
    // WHITE = GRASS
    if(r==255 && g==255 && b==255) miniMap[x][y] = this.entity("grass",grassTexture,"volumeTex",bushTexture);
    // R+G = FINSIH LINE
    else if(r==255 && g==255 && b==0) miniMap[x][y] = this.entity("finish",finishTexture,"floor",0);
    // G+B = CHECKPOINT
    else if(r==0 && g==255 && b==255) miniMap[x][y] = this.entity("checkpoint",checkpointTexture,"floor",0);
    // GREY = GRASS
    else if(r==240 && g==240 && b==240) miniMap[x][y] = this.entity("grass",grassTexture,"floor",0);
    // BLACK = WALL
    else if(r==0 && g==0 && b==0) miniMap[x][y] = this.entity("wall",wallTexture,"wall",0);
    // GREY 100 = ROAD
    else if(r==100 && g==100 && b==100) miniMap[x][y] = this.entity("road",roadTexture,"floor",0);
    // RED = SPEED
    else if(r==255 && g==0 && b==0) miniMap[x][y] = this.entity("speed",speedTexture,"floor",0);
    // BLUE = JUMP
    else if(r==0 && g==0 && b==255) miniMap[x][y] = this.entity("jump",jumpTexture,"floor",0);
    // GREEN = START
    else if(r==0 && g==255 && b==0) {
      startPoint = { x: x*this.scale, y: y*this.scale };
      miniMap[x][y] = this.entity("road",roadTexture,"road",0);
    }
    else miniMap[x][y] = this.entity("grass",grassTexture,"volumeTex",bushTexture);
  }

}
