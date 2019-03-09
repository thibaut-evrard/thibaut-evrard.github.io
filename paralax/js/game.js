/*Game states:
  - menu
  - intro
  - play
  - lose
  - gameOver
*/

function Game() {
  PIXI.Container.call(this);
  this.viewportSpeed = 0.2;
  this.state = "menu";
  this.setup();
  this.loadState(this.state);
}

Game.prototype = Object.create(PIXI.Container.prototype);

Game.prototype.setup = function() {
  this.scroller = new Scroller();

  this.scenery = new Scenery();
  this.addChild(this.scenery);

  this.collidables = new Collidables();
  this.addChild(this.collidables);

  this.player = new Bird();
  this.addChild(this.player);

  this.gui = new Gui();
  this.addChild(this.gui);
  this.gui.playButton.on('pointerdown', function() {
    game.loadState("intro");
  });
}

Game.prototype.reset = function() {
  this.removeChild(this.scroller);
  this.scroller = new Scroller();

  this.removeChild(this.scenery);
  this.scenery = new Scenery();
  this.addChild(this.scenery);

  this.removeChild(this.collidables);
  this.collidables = new Collidables();
  this.addChild(this.collidables);

  this.removeChild(this.player);
  this.player = new Bird();
  this.addChild(this.player);

  this.setChildIndex(this.gui,this.children.length-1);
}

Game.prototype.loadState = function(state) {
  switch(state) {
    case "menu":
      this.player.controlable = false;
      this.viewPortSpeed = 0.5;
      this.gui.load("menu");
      break;

    case "intro":
      soundAssets.theme.playFrom(0);
      soundAssets.theme.fadeIn(2);

      this.gui.load("intro");
      this.viewportSpeed = 4;
      setTimeout(function(){ game.loadState("play") }, 2000);
      break;

    case "play":
      this.player.controlable = true;
      this.collidables.init(this.scroller.getViewportX());
      break;

    case "lose":
      soundAssets.theme.fadeOut(1);
      soundAssets.crash.play();

      this.gui.load("lose");
      this.player.controlable = false;
      this.viewportSpeed = 0;
      console.log(this.viewportSpeed)
      setTimeout(function() {
        game.gui.gameOver.fading = true;
        soundAssets.gameOver.play();
      }, 1000);
      setTimeout(function(){ game.loadState("gameOver") }, 4000);
      break;

    case "gameOver":
      this.reset();
      this.player.controlable = false;
      this.gui.load("gameOver");
      setTimeout(function(){ game.loadState("menu") }, 2000);
      break;
  }
  this.state = state;
}

Game.prototype.update = function() {
  this.scroller.moveViewportXBy(this.viewportSpeed);
  var viewportX = this.scroller.getViewportX();

  this.scenery.setViewportX(viewportX);
  this.scenery.update();

  switch(this.state) {
    case "menu":
      this.gui.playButton.animate();

      break;
    case "intro":
      this.player.slideIn(120);

      break;
    case "play":
      this.player.update();
      this.player.animate();

      this.collidables.setViewportX(viewportX);
      this.collidables.update();

      var score = this.collidables.gates.passed.getValue(this.player);
      this.gui.score.set(score);
      this.viewportSpeed = 4 + (score /5);

      if(this.collidables.collides(this.player.hitbox)) {
        this.loadState("lose");
      }
      break;
    case "lose":
      this.player.update();
      this.player.die();
      this.gui.gameOver.fade("in",120);
      break;
    case "gameOver":
      this.gui.gameOver.fade("out",120);
      this.gui.score.fade("out",120);
      break;
  }
}
