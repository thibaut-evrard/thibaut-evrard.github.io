//THIS IS THE KART CLASS, IT TAKES CARE OF ALL THE ACTIONS RELATED TO THE DRIVING PART OF THE GAME

// CAR OBJECT CLASS- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class car {

  constructor(carStartingPoint) {
    this.length= 20;
    this.width= 20;
    this.speed = 0;
    this.speedZ = 1;
    this.speedMax = 20;
    //this.minZ = 17;
    this.pos = createVector(carStartingPoint.x,carStartingPoint.y,200);
    this.center = -200;
    this.angle = 0;
    this.angleMax = 0.05;
    this.accelerationRate = 100;
    this.decelerationRate = 15;
    this.angleRate = 0;
    this.angleDeceleration = 1;

    this.boostRate = 1.1;

    //sprite images
    this.annimTimer = 0;
    this.annimDeceleration = 0.8;

    var path = pathToTextures + '/kart/';
    this.image_3 = loadImage(path+"-3.png");
    this.image_2 = loadImage(path+"-2.png");
    this.image_1 = loadImage(path+"-1.png");
    this.image0 = loadImage(path+"0.png");
    this.image1 = loadImage(path+"1.png");
    this.image2 = loadImage(path+"2.png");
    this.image3 = loadImage(path+"3.png");

    this.sprite = this.image0;
  }

  // handles drawing and annimation of the car
  draw() {
    this.handleAnnimation();
    this.updateModel();
    this.updateRotation();
    this.steer();
    this.updateHitbox();
  }

  handleAnnimation() {
    var amount = map(this.speed,0,7,0,0.1);

    if(keyIsPressed) {
      if(keyIsDown(LEFT_ARROW)) {
        if(this.annimTimer >= -4 ) this.annimTimer -= amount;
      }

      if(keyIsDown(RIGHT_ARROW)) {
        if(this.annimTimer <= 4 ) this.annimTimer += amount;
      }
    }

    if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
      this.annimTimer /= 2;
    }

    // left
    if(this.annimTimer < -0.01) this.sprite = this.image_1;
    if(this.annimTimer < -1) this.sprite = this.image_2;
    if(this.annimTimer < -2) this.sprite = this.image_3;

    // right
    if(this.annimTimer > 0.01) this.sprite = this.image1;
    if(this.annimTimer > 1) this.sprite = this.image2;
    if(this.annimTimer > 2) this.sprite = this.image3;

    // straight
    if(this.annimTimer <= 0.01 && this.annimTimer >= -0.01) {
      this.sprite = this.image0;
    }

  }

  updateHitbox() {
    this.xHitboxMin = this.pos.x - this.length/3;
    this.xHitboxMax = this.pos.x - this.length/3;
    this.yHitboxMin = this.pos.y - this.width/3;
    this.yHitboxMax = this.pos.y - this.width/3;
  }

  // takes care of the visual part of the car
  updateModel() {
    fill(0,255,0);
    stroke(100);
    push();
    translate(this.pos.x,this.pos.y,this.pos.z);
    rotate(this.angle);
    rotateX(-PI/2);
    texture(this.sprite);
    plane(40);
    pop();
  }

  // takes care of rotating the car sprite around
  updateRotation() {
    var v = createVector(0,-this.speed);
    v.rotate(this.angle);
    this.pos.add(v);
  }

  // makes the car respond to user input
  steer(key) {
    // if the car is being moved
    if(keyIsPressed) {
      if(keyIsDown(UP_ARROW)) {
        if(this.speed == 0) { this.speed+=0.1; }
        else if(this.speed < this.speedMax) { this.speed += (this.speedMax-this.speed)/this.accelerationRate; }
      }
      if(keyIsDown(DOWN_ARROW)) {
        if(this.speed > 0) this.speed -= this.speed/this.decelerationRate;
      }
      if(keyIsDown(LEFT_ARROW)) {
        this.angleRate = -this.steerFromSpeed();
        //this.angle -= this.angleRate;
      }

      if(keyIsDown(RIGHT_ARROW)) {
        this.angleRate = this.steerFromSpeed();
        //this.angle += this.angleRate;
      }
    }

    //handling deceleration
    this.angle += this.angleRate;
    if((!keyIsDown(UP_ARROW) && !keyIsDown(UP_ARROW)) || this.speed>this.speedMax) {
      this.speed *= 0.99;
    }
    if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
      this.angleRate -= this.angleRate/this.angleDeceleration;
    }

    //handling Z position
    if(this.speedZ != 0 || this.pos.z != minZ+17) {
      this.speedZ += 1;
      this.pos.z-= this.speedZ;
    }
    if(this.pos.z<minZ+17) {
      this.pos.z = minZ+17;
      this.speedZ = 0;
    }
  }

  // subfunction of steer, handles the angle of steering depending on speed
  steerFromSpeed() {
    if(this.speed<1) {
      return this.angleMax*this.speed;
    }
    else {
      return this.angleMax;
    }
  }

  // when the car collides a wall.
  bump() {
    this.speed = -2;
    //this.speed = Math.sign(this.speed) * (-2);
  }

  jump(amount) {
    if(this.pos.z-17 == minZ) {
      this.speedZ = -amount;
    }
  }

  boost() {
    if(this.speed<45) this.speed *= this.boostRate;
  }
}
