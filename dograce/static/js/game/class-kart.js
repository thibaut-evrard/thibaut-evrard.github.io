// takes care of the driving and modifications applied to the car from the car's point of view

// CAR OBJECT CLASS- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class car {

  constructor(carStartingPoint) {
    this.heading = createVector(0,0);
    this.startingPoint = createVector(startPoint.x,startPoint.y,100);
    // FORCES AND POSITIONS VARIABLE (CAR PHYSICS)
    // variable and basic forces
    this.pos = createVector(startPoint.x,startPoint.y,100);
    this.alpha = 0;
    this.v = createVector(0,0); // car velocity
    this.speed = 0;
    this.u = createVector(0,1) // direction of the car
    this.engineForce = 0; // engineForce of the car
    this.a = createVector(0,0); // acceleration of the car
    this.weight = 120;
    this.rayon = 60;
    this.steerAngleMax = 1/this.rayon;
    this.wheelAngle = 0;
    this.raMax = 1;
    this.raMin = 0.1;
    this.wheelSpeed = 0;
    this.drift;
    this.minZ = 0;
    // constants
    this.cDrag = 0.01; // constante de drag
    this.cRr = 0.3;
    this.cBrake = 30; // braking force
    // compiled variables (higher level objects)
    this.fTraction = createVector(0,0);
    this.fDrag = createVector(0,0);
    this.fLong = createVector(0,0);
    this.fRr = createVector(0,0);
    this.fGravity = 0;

    // SUPER POWER FORCES
    this.boostRate = 1.04;

    // DIMENTIONS OF OBJECT
    this.length= 20;
    this.width= 20;

    //SPRITE
    this.annimTimer = 0;
    this.annimDeceleration = 0.8;
    var path = pathToTextures + '/kart/';
    //this.model = model;
    this.image_3 = loadImage(path+"-3.png");
    this.image_2 = loadImage(path+"-2.png");
    this.image_1 = loadImage(path+"-1.png");
    this.image0 = loadImage(path+"chevy.png");
    this.image1 = loadImage(path+"1.png");
    this.image2 = loadImage(path+"2.png");
    this.image3 = loadImage(path+"3.png");
    this.sprite = this.image0;

    this.mobileControls = {
      up: false,
      down: false,
      left: false,
      right: false,
      drift: false,
    }
  }

  // rendering the car -> MASTER FUNCTION
  update() {
    this.heading = p5.Vector.add(this.u).rotate(this.alpha);
    this.drive(); // handling user input
    this.doPhysics(); // applying the physics engine to the car
  }

  draw() {
    this.updateModel();
  }

  // TRANSLATES USER INPUT INTO CODE
  drive() {
    //this.wheelAngle *= 0.5;
    this.engineForce = 0;
    this.raMin = 0.1;
    this.drift = 0;
    // implement the angle in raMin
      if(keyIsDown(ESCAPE)) menu.pause();
      if(keyIsDown(32)) { this.drift = 1; this.v.mult(1.01);} //this.v.mult(0.99);
      if(keyIsDown(UP_ARROW)) this.engineForce = 8;
      if(keyIsDown(DOWN_ARROW) && this.speed<=1) { this.engineForce = -10; }
      if(keyIsDown(DOWN_ARROW) && this.speed>1)  this.v.mult(0.95);//this.engineForce = -this.cBrake;
      if(keyIsDown(RIGHT_ARROW) && abs(this.speed) > 0.1) this.smoothTurn(Math.sign(this.speed)*this.steerAngleMax);//this.alpha += this.steerAngleMax*this.speed;
      if(keyIsDown(LEFT_ARROW) && abs(this.speed) > 0.1) this.smoothTurn(Math.sign(this.speed)*-this.steerAngleMax);
      if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) this.smoothTurn(0);
  }

  smoothTurn(max) {
    var distance = max - this.wheelAngle;
    //if(this.drift == 1 ) this.wheelAngle += distance/40;
    this.wheelAngle += distance/5;
  }

  // PHYSICS ENGINE FOR THE KART OBJECT
  doPhysics() {
    ///////////////////// SIDEWAYS /////////////////////////
    // CALCULATE THE DRIFT
    this.wheelSpeed = this.calculateDrift(this.wheelSpeed);

    // COMPUTE LATERAL FORCES
    var lateralForces = this.calculateWheelLateralFriction();
    this.v.x -= Math.sign(this.v.x)*lateralForces;

    // UPDATE ANGLE
    var speed = this.speed;
    if(this.wheelSpeed == 0 && this.speed>2) { speed = 2 + (this.speed/8); }
    var turnForce = this.wheelAngle * speed;
    // APPLY TRANSFORMATIONS
    this.v.rotate(-turnForce);
    this.alpha += turnForce;

    ///////////////////// FORWARD /////////////////////////
    this.calculateLongitudinalForces();

    ///////////////////// DOWN ////////////////////////////
    this.calculateGravity();

    // UPDATING CAR VELOCITY AND POSITION
    this.v.add(this.a);
    var p = p5.Vector.add(this.v);
    p.rotate(this.alpha);

    this.pos.sub(p.mult(3));
  }

  // PHYSICS SUBFUNCTION #1 (HANDLES WHEEL FRICTION LATERALLY WHEN THE CAR IS NOT DRIFTING)
  calculateWheelLateralFriction() {
    // WHEEL LATERAL FRICTION
    var temoin = createVector(0,1);
    var directionAngle = 0;
    if(this.v.heading()) directionAngle += this.v.angleBetween(temoin); // direction of the car compared to it's front.
    var angleNormal;
    if(directionAngle > PI/2) angleNormal = PI - directionAngle;
    else angleNormal = directionAngle;
    var wheelLateralFriction = map(angleNormal,0,PI/2,this.raMin,this.raMax);
    if(abs(this.v.x) < wheelLateralFriction) wheelLateralFriction = abs(this.v.x);
    return wheelLateralFriction;
  }
  // PHYSICS SUBFUNCTION #2 (HANDLES THE LONGITUDINAL BEHAVIOUR OF THE CAR)
  calculateLongitudinalForces() {
    // CALCULATE LONGITUDINAL FORCES
    this.speed = this.v.mag();
    this.fTraction = p5.Vector.mult(this.u,this.engineForce);
    this.fDrag = createVector(this.v.x*abs(this.v.x),this.v.y*abs(this.v.y)).mult(-this.cDrag); //fdrag = -(v*|v|)*cDrag;
    this.fRr =  p5.Vector.mult(this.v,this.cRr).mult(-1); // fRr = -v*cRr;
    var fBack = p5.Vector.add(this.fDrag, this.fRr); // calculate resistance forces
    // RESULT:
    this.fLong = p5.Vector.add(this.fTraction,fBack); // calculate the longitudinal forces
    this.a = p5.Vector.div(this.fLong, this.weight);
  }
  // PHYSICS SUBFUNCTION #3 (SWITCHES THE PHYSICS OF THE CAR WHEN IT IS DRIFTING)
  calculateDrift(wheelSpeed) {
    // simple wheelspeed
    this.raMin = 0.3;
    this.raMax = 0.9;
    var angleTreshold = 0.1;

    if(this.drift == 1) {
      wheelSpeed = 1;
    }

    if(this.drift == 0 && wheelSpeed>0 && this.engineForce > 0) {
      if(wheelSpeed <= 10) wheelSpeed += 0.01;
      if(abs(this.v.x) <= angleTreshold) {
        wheelSpeed = 0;
      }
    }

    if(wheelSpeed > 0) {
      this.raMin = map(wheelSpeed,1,0,0.1,0.5);
      this.raMax = map(wheelSpeed,1,0,0.5,0.9);
      wheelSpeed -= 0.04;
      if(wheelSpeed < 0.1) wheelSpeed = 0;
    }
    //console.log(wheelSpeed);
    return wheelSpeed;
  }

  // PHYSICS SUBFUNCTION #4 (GRAVITY)
  calculateGravity() {
    var ground = minZ + 17;
    this.pos.z -= this.fGravity;
    if(this.pos.z < ground) {
      this.fGravity = 0;
      this.pos.z = ground;
    }
    if(this.pos.z > ground) {
      this.fGravity += 0.6;
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
    //fill(0,255,0);
    //stroke(100);
    push();
    translate(this.pos.x,this.pos.y,this.pos.z);
    rotate(this.alpha);
    rotateX(-PI/2);
    texture(this.sprite);
    plane(70,40);
    pop();
  }

  // when the car collides a wall.
  bump(pos) {
    this.v.mult(0.8);
    var dx =  this.pos.x - pos.x;
    var dy = this.pos.y - pos.y;
    if(abs(dx) < abs(dy)) {
      if(dy>0) this.pos.y += (70-abs(dy));
      if(dy<0) this.pos.y -= (70-abs(dy));
    }
    if(abs(dy) < abs(dx)) {
      if(dx>0) this.pos.x += (70-abs(dx));
      if(dx<0) this.pos.x -= (70-abs(dx));
    }
  }

  jump(amount) {
    if(this.pos.z <= 17) {
      this.fGravity = -amount;
    }
  }

  boost() {
    if(this.speed<45) this.v.y *= this.boostRate;
  }

  restart() {
    this.heading = createVector(0,0);
    this.startingPoint = createVector(startPoint.x,startPoint.y,100);
    // FORCES AND POSITIONS VARIABLE (CAR PHYSICS)
    // variable and basic forces
    this.pos = createVector(startPoint.x,startPoint.y,100);
    this.alpha = 0;
    this.v = createVector(0,0); // car velocity
    this.speed = 0;
    this.u = createVector(0,1) // direction of the car
    this.engineForce = 0; // engineForce of the car
    this.a = createVector(0,0); // acceleration of the car
    this.weight = 120;
    this.rayon = 60;
    this.steerAngleMax = 1/this.rayon;
    this.wheelAngle = 0;
    this.raMax = 1;
    this.raMin = 0.1;
    this.wheelSpeed = 0;
    this.drift;
    this.minZ = 0;
    // constants
    this.cDrag = 0.01; // constante de drag
    this.cRr = 0.3;
    this.cBrake = 30; // braking force
    // compiled variables (higher level objects)
    this.fTraction = createVector(0,0);
    this.fDrag = createVector(0,0);
    this.fLong = createVector(0,0);
    this.fRr = createVector(0,0);
    this.fGravity = 0;
  }
}
