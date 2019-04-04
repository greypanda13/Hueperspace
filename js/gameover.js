var musicGameOver;

var gameoverState = {
  create: function () {
    var nameLabel = game.add.text(80, 80, "GAMEOVER TITLE", {font: "50px Arial", fill: "#fff"});
    var startLabel = game.add.text(80, game.world.height-80,
    "press the 'W' key to restart", {font: "25px Arial", fill: "#fff"});
    var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    wkey.onDown.addOnce(this.start, this);
  },

  start: function () {
    musicGameOver = game.add.audio("gameover");
    musicGameOver.play();
    game.state.start("play");
  }
}
