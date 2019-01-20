class circuit {
  constructor() {
    this.pngToMapScale = 100;
  }

  draw() {
    this.drawBackground();
    optimisation.updateOptimisationState();
    optimisation.drawCompressedFloorTexture();
    optimisation.drawCompressedObjs3d();
  }

  drawBackground() {
    push();
      translate(2500,2500);
      for(var i=0; i<4; i++) {
        let size = 10000;
        rotate(PI/2)
        push();
        translate(0,-size/2,(size/2)/4);
        rotateX(-PI/2);
        texture(backgroundTexture2);
        plane(size,size/4);
        pop();
      }
      for(var i=0; i<4; i++) {
        let size = 8000;
        rotate(PI/2)
        push();
        translate(0,-size/2,(size/2)/4);
        rotateX(-PI/2);
        texture(backgroundTexture1);
        plane(size,size/4);
        pop();
      }

    pop();
  }

  drawEntity(x,y,obj) {
    var scale = this.pngToMapScale;
    push();
      translate(x*scale,y*scale);
      //fill(255);
      texture(obj.tex);
      if(obj.type == "wall") {
        translate(0,0,(obj.scale.z*scale)/2);
        box(obj.scale.x*scale, obj.scale.y*scale, obj.scale.z*scale);
      }
      //else plane(obj.scale.x*scale,obj.scale.y*scale);
    pop();
  }

  worldEvent() {
    var x = Math.round(car.pos.x/100)
    var y = Math.round(car.pos.y/100)
    var position = createVector(x,y);

    var cx = (car.pos.x)/100;
    var cy = (car.pos.y)/100;
    var pos = createVector(cx,cy);
    var d = car.length/100;
    //console.log(pos);
    this.applyEvent(position.x,position.y);
    if(Math.round(cx+d) > x) this.applyEvent(Math.round(cx+d),y);
    if(Math.round(cx-d) < x) this.applyEvent(Math.round(cx-d),y);
    if(Math.round(cy-d) < y) this.applyEvent(x,Math.round(cy-d));
    if(Math.round(cy+d) > y) this.applyEvent(x,Math.round(cy+d));
  }

  applyEvent(x,y) {
    var position = createVector(x,y)
    if(position.x>0 && position.y>0 && position.x<(miniMap.length) && position.y<(miniMap[0].length)) {
      var entity = miniMap[position.x][position.y];
      var event = entity.name;
      if(car.pos.z == minZ+17) {
        car.cRr = 0.3;
        switch(event) {
          case "grass":
            car.cRr = 5;
          break;
          case "jump":
            car.jump(10);
          break;
          case "speed":
            car.boost();
          break;
          case "road":
            car.cRr = 0.3;
          break;
          case "wall":
            var pos = { x:x*100, y:y*100 }
            if(minZ < entity.scale.z*100)car.bump(pos);
          break;
          case "checkpoint":
            checkpoint = true;
          break;
          case "finish":
            if(checkpoint == true) {
              lapsLeft -= 1;
              checkpoint = false;
            }
          break;
        }
      }
      if(car.pos.z > minZ+17) {
        if(event == "wall") minZ = entity.scale.z*100;
      }
    }
  }

}
