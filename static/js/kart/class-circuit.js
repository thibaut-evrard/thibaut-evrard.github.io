class circuit {
  constructor() {
    this.pngToMapScale = 100;
  }

  draw() {
    optimisation.updateObjsClipping();
    optimisation.drawCompressedFloorTexture();
    optimisation.drawCompressedObjs3d();
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
            car.cRr = 2;
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
        }
      }
      if(car.pos.z > minZ+17) {
        if(event == "wall") minZ = entity.scale.z*100;
      }
    }
  }

}
