class circuit {
  constructor() {
    this.pngToMapScale = 100;
  }

  draw() {
    for(var x=0; x<miniMap.length; x++) {
      for(var y=0; y<miniMap[0].length; y++) {
        this.drawEntity(x,y,miniMap[x][y]);
      }
    }
  }

  drawEntity(x,y,obj) {
    var scale = this.pngToMapScale;
    push();
      translate(x*scale,y*scale);
      texture(roadTexture);
      if(this.type == "wall") box(100, 100, 100);
      else plane(obj.scale*scale, obj.scale*scale);
    pop();
  }

}
