class colidable {
  constructor(type,scale,x,y) {
    this.clippingDistance = 3000;
    this.scale = scale;
    this.length = 100;
    this.width = 100;

    this.delay = 0;
    this.clippingValue = false;

    switch(type) {
      case "wall":
      this.pos = createVector(x*scale,y*scale,0);
      this.height = 30;
      this.type = "wall";
      this.center = this.height/2;
      this.build = "box";
      this.texture = loadImage(pathToTextures + '/world/wall.png');
        break;

      case "road":
      this.pos = createVector(x*scale,y*scale,0.1);
      this.height = 0;
      this.type = "road";
      this.center =  0.1;
      this.build = "plane";
      this.texture = loadImage(pathToTextures + '/world/road.png');
        break;

      case "grass":
      this.pos = createVector(x*scale,y*scale,0.1);
      this.height = 0;
      this.type = "grass";
      this.center = 0.1;
      this.build = "plane";
      this.texture = loadImage(pathToTextures + '/world/grass.png');
        break;

      case "speed":
      this.pos = createVector(x*scale,y*scale,0.1);
      this.height = 0;
      this.type = "speed";
      this.center = 0.1;
      this.build = "plane";
      this.texture = loadImage(pathToTextures + '/world/speed.png');
        break;

      case "jump":
      this.pos = createVector(x*scale,y*scale,0.1);
      this.height = 0;
      this.type = "jump";
      this.center = 0.1;
      this.texture = loadImage(pathToTextures + '/world/wall.png');
      this.build = "plane";
        break;

      case "start":
      this.pos = createVector(x*scale,y*scale,0.1);
      this.height = 0;
      this.type = "start";
      this.center = 0.1;
      this.texture = loadImage(pathToTextures + '/world/wall.png');
      this.build = plane;
        break;
    }
  }

  draw(cabHeading) {

    this.delay ++;
    if(dist(this.pos.x,this.pos.y,this.pos.z,cab.pos.x,cab.pos.y,cab.pos.z) < 100) this.collider();
    if((this.delay%5) == 0) this.clippingValue = this.clipping(cabHeading,this.pos.x,this.pos.y);
    if(this.clippingValue == true) {
      push();
        translate(this.pos.x,this.pos.y,this.pos.z+this.center);
        texture(this.texture);
        if(this.build == "plane") { plane(this.length, this.width); }
        else { box(this.length,this.width,this.height); }
      pop();
    }
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

  collider() {
    var xHitdist = (cab.length/2) + (this.length/2);
    var yHitdist = (cab.width/2) + (this.width/2);
    var zHitdist = (this.height+3);

    var xDist = abs(cab.pos.x - this.pos.x);
    var yDist = abs(cab.pos.y - this.pos.y);
    var zDist = abs((cab.pos.z-17) - (this.pos.z));

    if(xDist<xHitdist && yDist<yHitdist && zDist>=zHitdist) {
      var val = this.pos.z + zHitdist;
      if(this.type == "wall") minZ = val;
    }

    if(xDist<xHitdist && yDist<yHitdist && zDist<zHitdist) {
      //alert("now");
      //console.log("zdist = " + zDist + ", zhDist = " + zHitdist);
      if(this.type == "wall") cab.bump(this.pos);
      if(this.type == "speed") cab.boost();
      if(this.type == "jump") cab.jump(10);
    }
  }
}
