function Gui() {
  this.font = 'Fredoka One';

  PIXI.Container.call(this);

  this.init();
}

Gui.prototype = Object.create(PIXI.Container.prototype);

Gui.prototype.init = function() {
  this.playButton = this.createPlayButton();
  this.addChild(this.playButton);

  this.gameOver = this.createGameOver();
  this.addChild(this.gameOver);

  this.score = this.createScore();
  this.addChild(this.score);
}

// creates the play button interactive sprite
Gui.prototype.createPlayButton = function() {
  let texture = resources["assets/playButton.png"].texture;
  playButton = new Sprite(texture);
  playButton.anchor.set(0.5,0.5);
  playButton.position.set(Width/2,Height/2);
  playButton.interactive = true;
  playButton.buttonMode = true;
  playButton.animate = function(ticker) {
    var d = new Date();
    var val = Math.sin(d.getTime()/200)
    this.scale.set(1+(val/10));
  }
  return playButton;
}

// creates the score text and set it to 0
Gui.prototype.createScore = function() {
  let score = new PIXI.Text("Score: " + 0);
  score.style = {fill: "white", fontFamily: this.font};
  score.position.set(20,20);
  score.value = 0;
  score.set = function(value) {
    this.value = value;
    this.text = "Score: " + this.value;
  }
  score.fading = true;
  score.fade = function(type,speed) {
    if(this.fading == true) {
      if(type == "in" && this.alpha <= 1) {
        this.alpha += 1/(speed*ticker);
      }
      else if(type == "out" && this.alpha >= 0) {
        this.alpha -= 1/(speed*ticker);
      }
    }
  }
  return score;
}

Gui.prototype.createGameOver = function() {
  let backdrop = new PIXI.Graphics();
  backdrop.beginFill(0x000000);
  backdrop.drawRect(0,0,Width,Height)

  let message = new PIXI.Text("GAME OVER");
  message.style = {fill: "white", fontFamily: this.font, fontSize: 50};
  message.position.set(Width/2,Height/2);
  message.anchor.set(0.5,0.5)

  let gameOver = new Container();
  gameOver.addChild(backdrop);
  gameOver.addChild(message);
  gameOver.fading = false;
  gameOver.fade = function(type,speed) {
    if(this.fading == true) {
      if(type == "in" && this.alpha <= 1) {
        this.alpha += 1/(speed*ticker);
      }
      else if(type == "out" && this.alpha >= 0) {
        this.alpha -= 1/(speed*ticker);
      }
    }
  }

  return gameOver;
}

// Load functions: sets up the GUI for a specific game state
Gui.prototype.load = function(state) {
  switch(state) {
    case "menu":
      this.playButton.visible = true;
      this.playButton.interactive = true;
      this.score.set(0);
      this.score.visible = false;
      this.score.alpha = 1;
      this.gameOver.visible = false;
      this.gameOver.alpha = 1;
      this.gameOver.fading = false;
      break;

    case "intro":
      this.playButton.visible = false;
      this.score.visible = true;
      this.gameOver.visible = false;
      break;

    case "play":
      break;

    case "lose":
      this.score.visible = true;
      this.gameOver.visible = true;
      this.gameOver.alpha = 0;
      var that = this
      break;

    case "gameOver":
      this.score.visible = true;
      this.playButton.visible = true;
      this.playButton.interactive = false;
      this.gameOver.visible = true;
      this.gameOver.alpha = 1;
      break;
  }
}
