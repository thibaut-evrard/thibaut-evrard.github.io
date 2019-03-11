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
  this.InitialGameSpeed = 3;
  this.state = "menu";
  this.setup();
  this.loadState(this.state);
}

Game.prototype = Object.create(PIXI.Container.prototype);

// create instance of classes and add them to the game container
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
  this.loadControls();
}

// reset the game after gameover state
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

// prepare the game for the next state
Game.prototype.loadState = function(state) {
  switch(state) {
    case "menu":
      this.gui.load("menu");
      this.player.controlable = false;
      this.viewPortSpeed = 0.5;
      break;

    case "intro":
      this.gui.load("intro");
      soundAssets.theme.playFrom(0);
      soundAssets.theme.fadeIn(2);
      // set the initial scrolling speed
      this.viewportSpeed = this.InitialGameSpeed;

      // pixi comes in the screen from the left
      this.player.slideIn(1750);
      // 3, 2, 1, GO!
      this.gui.countDown.count(1750);
      // change the game to "play" after player is in and countdown is finished
      setTimeout(function(){ game.loadState("play") }, 1750);
      break;

    case "play":
      this.player.controlable = true;
      // create the gates and add them to the stage
      this.collidables.init(this.scroller.getViewportX());
      break;

    case "lose":
      this.gui.load("lose");
      soundAssets.theme.fadeOut(1);
      soundAssets.crash.play();
      // the control events no longer affect the player
      this.player.controlable = false;
      // stops the scroll
      this.viewportSpeed = 0;
      // after a second, play the lose sound and fade to the gameOver screen
      setTimeout(function() { game.gui.fadeAlpha(game.gui.gameOver,2000,1); }, 1000);
      setTimeout(function() { soundAssets.gameOver.play(); }, 1000);
      // go to the gameover state after 4 seconds
      setTimeout(function(){ game.loadState("gameOver") }, 4000);
      break;

    case "gameOver":
      this.gui.load("gameOver");
      // reset the game (except from gui)
      this.reset();
      this.player.controlable = false;
      // go back to the menu after 2 seconds
      setTimeout(function(){ game.loadState("menu") }, 2000);
      break;
  }
  this.state = state;
}

// updates the current state
Game.prototype.update = function() {
  // update the scroller
  this.scroller.moveViewportXBy(this.viewportSpeed);
  var viewportX = this.scroller.getViewportX();
  // update the scenery
  this.scenery.setViewportX(viewportX);
  this.scenery.update();

  switch(this.state) {
    case "menu":
      break;

    case "intro":
      break;

    case "play":
      // update the player position and rotation
      this.player.update();
      this.player.animate();

      // update the position of collidables
      this.collidables.setViewportX(viewportX);
      // delete useless gates and add new ones if needed
      this.collidables.update();

      // update the score
      var score = this.collidables.gates.passed.getValue(this.player);
      this.gui.score.set(score);
      this.viewportSpeed = this.InitialGameSpeed + (score /5);

      // go to the lose state if the player hits a column
      if(this.collidables.collides(this.player.hitbox)) {
        this.loadState("lose");
      }
      break;

    case "lose":
      // update the poisition of the player
      this.player.update();
      // animate the player to "die"
      this.player.die();
      break;

    case "gameOver":
      break;
  }
}

Game.prototype.loadControls = function() {
  // when spacebar is pressed
  document.addEventListener("keypress", function(event) {
    if(event.key === " ") {
      game.player.control();
      event.stopPropagation();
    }
  });

  document.addEventListener("click", function(event) {
    // the only use of this event is to enable the browser to recognise interaction and allow sound
  });

  app.stage.on('pointerdown', function(event) {
    game.player.control();
    event.stopPropagation();
  });

  this.gui.playButton.on('pointerdown', function() {
    game.loadState("intro");
  });
}

Game.prototype.resize = function() {
  this.gui.resize();
  this.scenery.resize();
  this.player.resize();
}
