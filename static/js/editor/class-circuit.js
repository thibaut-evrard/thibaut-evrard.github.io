class circuit {
  constructor() {
    this.pngToMapScale = 100;
  }

  draw() {
    this.drawEntities();
    this.drawMousePointer();
    if(mouseIsPressed) {
      this.addObjectToMinimap(brickName,Math.floor(mouseX/10),Math.floor(mouseY/10));
    }
  }

  drawEntities() {
    for(var x=0; x<miniMap.length; x++) {
      for(var y=0; y<miniMap[0].length; y++) {
        image(miniMap[x][y].tex,x*10,y*10,10,10);
      }
    }
  }

  drawMousePointer() {
    var tex = this.getTextureFromName(brickName);
    var x = int(mouseX/10);
    var y = int(mouseY/10);
    image(tex,x*10,y*10,10,10);
    fill(255,100);
    rect(x*10,y*10,10,10);
  }

  entity(name,tex,type,tex3d) {
    // var t = createGraphics(10,10);
    // t.image(tex,0,0,t.width,t.height);
    //console.log("working on next texture");

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
  addObjectToMinimap(name,x,y) {
    switch(name) {
      case "grass": miniMap[x][y] = this.entity("grass",grassTexture,"volumeTex",bushTexture); break;
      case "finish": miniMap[x][y] = this.entity("finsih",finishTexture,"floor",0); break;
      case "wall": miniMap[x][y] = this.entity("wall",wallTexture,"wall",0); break;
      case "road": miniMap[x][y] = this.entity("road",roadTexture,"floor",0); break;
      case "speed": miniMap[x][y] = this.entity("speed",speedTexture,"floor",0); break;
      case "jump": miniMap[x][y] = this.entity("jump",jumpTexture,"floor",0); break;
      case "start": miniMap[x][y] = this.entity("road",roadTexture,"road",0); break;
    }
  }

  getTextureFromName(name) {
    switch(name) {
      case "grass": return grassTexture;
      case "finish": return finishTexture;
      case "wall": return wallTexture;
      case "road": return roadTexture;
      case "speed": return speedTexture;
      case "jump": return jumpTexture;
      case "start": return startTexture;
    }
  }
}
