function Gui() {
  this.font = 'Fredoka One';

  PIXI.Container.call(this);

  this.init();
}

Gui.prototype = Object.create(PIXI.Container.prototype);

// create all children instances of GUI and add them to the container
Gui.prototype.init = function() {
  this.playButton = this.createPlayButton();
  this.addChild(this.playButton);

  this.gameOver = this.createGameOver();
  this.addChild(this.gameOver);

  this.score = this.createScore();
  this.addChild(this.score);

  this.countDown = this.createCountDown();
  this.addChild(this.countDown);
}

// create the countdown object (3, 2, 1, GO)
Gui.prototype.createCountDown = function() {
  var that = this;
  let countDown = new PIXI.Text("3");
  countDown.style = {fill: "white", fontFamily: this.font, fontSize: 100};
  countDown.position.set(Width/2,Height/2);
  countDown.anchor.set(0.5,0.5);
  countDown.text = "3";
  countDown.count = function(time) {
    var step = time/4
    setTimeout(function() { countDown.text = "2"; }, step);
    setTimeout(function() { countDown.text = "1"; }, 2*step);
    setTimeout(function() { countDown.text = "GO!"; }, 3*step);
    setTimeout(function() { that.fadeAlpha(countDown,step,-1) }, 3*step);
    setTimeout(function() { countDown.visible = false; }, 4*step);
  }
  return countDown;
}

// create the Play Button
Gui.prototype.createPlayButton = function() {
  let texture = resources["assets/playButton.png"].texture;
  playButton = new Sprite(texture);
  playButton.anchor.set(0.5,0.5);
  playButton.position.set(Width/2,Height/2);
  playButton.interactive = true;
  playButton.buttonMode = true;
  playButton.animateVal = 0;
  playButton.animate = function() {
    var that = this;
    that.animation = setInterval(function() {
      that.animateVal+=0.05;
      var val = Math.sin(that.animateVal);
      that.scale.set(1+(val/10));
    },10);
  }
  playButton.stopAnimation = function() {
    var that = this;
    clearInterval(that.animation);
  }
  return playButton;
}

// create the score panel and set it to 0
Gui.prototype.createScore = function() {
  let score = new PIXI.Text("Score: " + 0);
  score.style = {fill: "white", fontFamily: this.font};
  score.position.set(20,20);
  score.value = 0;
  score.set = function(value) {
    this.value = value;
    this.text = "Score: " + this.value;
  }
  return score;
}

// create the Game Over sign
Gui.prototype.createGameOver = function() {
  backdrop = new PIXI.Graphics();
  backdrop.beginFill(0x000000);
  backdrop.drawRect(0,0,Width,Height)

  message = new PIXI.Text("GAME OVER");
  message.style = {fill: "white", fontFamily: this.font, fontSize: 50};
  message.position.set(Width/2,Height/2);
  message.anchor.set(0.5,0.5)

  let gameOver = new Container();
  gameOver.addChild(backdrop);
  gameOver.addChild(message);
  return gameOver;
}

// Change the GUI when a new state comes in
Gui.prototype.load = function(state) {
  switch(state) {
    case "menu":
      this.reset();
      this.playButton.animate();
      break;

    case "intro":
      this.playButton.stopAnimation();

      this.playButton.visible = false;
      this.score.visible = true;

      this.countDown.visible = true;
      break;

    case "play":
      this.countDown.visible = false;
      break;

    case "lose":
      this.gameOver.visible = true;
      this.gameOver.alpha = 0;
      break;

    case "gameOver":
      this.playButton.visible = true;
      this.playButton.interactive = false;
      this.gameOver.alpha = 1;
      break;
  }
}

// reset the instances to their original state
Gui.prototype.reset = function() {
  this.score.visible = false;
  this.score.alpha = 1;
  this.score.set(0);

  this.gameOver.visible = false;
  this.gameOver.alpha = 1;

  this.countDown.visible = false;
  this.countDown.alpha = 1;
  this.countDown.text = "3";

  this.playButton.visible = true;
  this.playButton.interactive = true;
}

// handle the alpha fading of a sprite/container
/*
sign: 1 -> fade in
     -1 -> fade out
*/
Gui.prototype.fadeAlpha = function(member,time,sign) {
  var f = setInterval(function() {
    member.alpha += (sign * 1) / (time/10);
    if(member.alpha >= 1) {
      clearInterval(f);
      member.alpha = 1;
    }
    else if(member.alpha <= 0) {
      clearInterval(f);
      member.alpha = 0;
    }
  },10);
}

Gui.prototype.resize = function() {
  this.countDown.position.set(Width/2,Height/2);
  this.playButton.position.set(Width/2,Height/2);
  this.gameOver.children[1].position.set(Width/2,Height/2);
  this.gameOver.children[0].width = Width;
}
