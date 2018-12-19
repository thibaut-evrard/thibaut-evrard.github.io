class Car {
  constructor() {
    this.v = createVector(0,0); // car velocity
    this.position = createVector(300,300); // car position
    this.speed = 0;
    this.u = createVector(0,1) // direction of the car
    this.engineForce = 0; // engineForce of the car
    this.a = createVector(0,0); // acceleration of the car
    this.weight = 100;
    this.alpha = 0;
    this.rayon = 80;
    this.steerAngleMax = 1/this.rayon;
    this.wheelAngle = 0;
    this.raMax = 1;
    this.raMin = 0.1;
    this.wheelSpeed = 0;
    this.drift;

    this.cDrag = 0.01; // constante de drag
    this.cRr = 0.3;
    this.cBrake = 10; // braking force

    this.fTraction = createVector(0,0);
    this.fDrag = createVector(0,0);
    this.fLong = createVector(0,0);
    this.fRr = createVector(0,0);
  }

  drive() {
    this.wheelAngle = 0;
    this.engineForce = 0;
    this.raMin = 0.1;
    this.drift = 0;
    // implement the angle in raMin
      if(keyIsDown(UP_ARROW)) this.engineForce = 10;
      if(keyIsDown(DOWN_ARROW)) this.engineForce = -this.cBrake;
      if(keyIsDown(RIGHT_ARROW) && abs(this.speed) > 0.1) this.wheelAngle = this.steerAngleMax;//this.alpha += this.steerAngleMax*this.speed;
      if(keyIsDown(LEFT_ARROW) && abs(this.speed) > 0.1) this.wheelAngle = -this.steerAngleMax;
      if(keyIsDown(32)) { this.v.mult(0.99); this.drift = 1; }
  }

  doPhysics() {

    ///////////////////// LATERAL /////////////////////////
    // CALCULATE THE DRIFT
    this.wheelSpeed = this.calculateDrift(this.wheelSpeed);

    // COMPUTE LATERAL FORCES
    var lateralForces = this.calculateWheelLateralFriction();
    this.v.x -= Math.sign(this.v.x)*lateralForces;

    // UPDATE ANGLE
    var speed = this.speed;
    if(this.wheelSpeed == 0 && this.speed>2) { speed = 2 + (this.speed/10); }
    var turnForce = this.wheelAngle * speed;
    // APPLY TRANSFORMATIONS
    this.v.rotate(-turnForce);
    this.alpha += turnForce;

    ///////////////////// LATERAL /////////////////////////
    this.calculateLongitudinalForces();

    // UPDATING CAR VELOCITY AND POSITION
    this.v.add(this.a);
    var p = p5.Vector.add(this.v);
    p.rotate(this.alpha);

    this.position.add(p);
  }

  draw() {
    background(255,0,0);
    ellipse(this.position.x,this.position.y,10,10);
    push();
      translate(this.position.x,this.position.y);
      rotate(this.alpha);
      rect(-10,-20,20,40);
      line(0,0,this.v.x*30,0)
      line(0,0,0,this.v.y*30)
      stroke(0,255,0);
      line(0,0,this.v.x*30,this.v.y*30)

    pop();
  }

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

  calculateDrift(wheelSpeed) {
    // simple wheelspeed
    this.raMin = 0.3;
    this.raMax = 0.8;

    if(this.drift == 1) {
      wheelSpeed = 1;
    }

    if(this.drift == 0 && wheelSpeed>0 && this.engineForce > 0) {
      if(wheelSpeed <= 1) wheelSpeed += 0.01;
      if(abs(this.v.x) <= 0.01) {
        wheelSpeed = 0;
      }
    }

    if(wheelSpeed > 0) {
      this.raMin = map(wheelSpeed,1,0,0.01,0.3);
      this.raMax = map(wheelSpeed,1,0,0.2,0.8);
      wheelSpeed -= 0.01;
      if(wheelSpeed < 0.1) wheelSpeed = 0;
    }
    console.log(wheelSpeed);
    return wheelSpeed;
  }
}

var kart

function setup() {
  createCanvas(600,600);
  // CONSTANTS ONLY
  kart = new Car();
}

function draw() {
  kart.doPhysics();
  kart.drive();
  kart.draw();
}
