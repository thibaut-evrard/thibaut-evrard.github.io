// THIS IS THE TRACK CLASS, IT TAKES CARE OF ALL THE NON PLAYER INTERACTIVE OBJECTS IN THE GAME.
// IT ALSO TAKES CARE OF TRANSLATING THE PNG ITO A REAL LIFE MAP

// OBSTACLES CLASS (WALLS)- - - - - - - - - - - - - - - - - - - - - - - - - - -
class track {
  constructor(img,scale) {
    // multiplication rate from PNG to real life
    this.scale = scale;
    this.minZ = 0;
    // dimetions and looks
    this.length = 100;
    this.width = 100;
    this.height = 30;

    this.floorPlan = img;
    this.land = new Array();
    this.miniMap = new Array();
    this.clippingDistance = 2000;

    this.carStartingPoint = { x:0, y:0 };
  }

  translateTrack() {
    this.floorPlan.loadPixels();
    this.initMiniMap(this.floorPlan.height,this.floorPlan.width);
    for(var y=0; y<this.floorPlan.height; y++) {
      for(var x=0; x<this.floorPlan.width; x++) {
        var pos = (y*this.floorPlan.width + x)*4;
        var r = this.floorPlan.pixels[pos];
        var g = this.floorPlan.pixels[pos+1];
        var b = this.floorPlan.pixels[pos+2];
        this.storeObjects(r,g,b,x,y);
      }
    }
  }

  addToTexture(x,y,itemTexture) {
    //this.mapTexture.loadPixels();
    mapTexture.copy(itemTexture,0,0,textureTileScale,textureTileScale,x*worldScale,y*worldScale,worldScale,worldScale);
    //this.mapTexture.updatePixels();
  }

  initMiniMap(height,length) {
    for(var x=0; x<length; x++) {
      var row = [];
      for(var y=0; y<length; y++) row.push(0);
      this.miniMap.push(row);
    }
  }

  storeObjects(r,g,b,x,y) {
    // WHITE = GRASS
    if(r==255 && g==255 && b==255) {
      myEnvironment.addToTexture(x, y, grassTexture);
      this.miniMap[x][y] = "grass";
    }

    // white 10 = grassBuste
    if(r==240 && g==240 && b==240) {
      myEnvironment.addToTexture(x, y, grassTexture);
      this.miniMap[x][y] = "grassbuste";
      console.log("addedGrass")
    }


    // BLACK = WALL
    if(r==0 && g==0 && b==0) {
      var obstacle = new colidable("wall",this.scale,x,y);
      this.land.push(obstacle);
      console.log("wall pushed");
     }

   // GREY 100 = ROAD
   if(r==100 && g==100 && b==100) {
     myEnvironment.addToTexture(x, y, roadTexture)
     this.miniMap[x][y] = "road";
    }

    // RED = SPEED
    if(r==255 && g==0 && b==0) {
      myEnvironment.addToTexture(x, y, speedTexture)
      this.miniMap[x][y] = "speed";
    }

    // BLUE = JUMP
    if(r==0 && g==0 && b==255) {
      myEnvironment.addToTexture(x, y, jumpTexture)
      this.miniMap[x][y] = "jump";
    }

    // GREEN = START
    if(r==0 && g==255 && b==0) {
      this.carStartingPoint = { x: x*this.scale, y: y*this.scale }
    }
  }

  drawTrack(car) {
    //fill(200);
    //texture(this.mapTexture);
    //plane(1000,1000);
    var cabHeading = p5.Vector.add(cab.u).rotate(cab.alpha);
    for(var i=0; i<this.land.length; i++) {
      this.land[i].draw(cabHeading);
    }
  }
}
