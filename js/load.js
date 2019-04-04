var loadState = {
  preload: function () {
    var loadingLabel = game.add.text(80, 150, "loading...", {font: "30px Courier", fill: "#fff"});
    game.load.spritesheet("sky", "assets/img/spaceall2.png", 800, 600);
    game.load.image("barihor", "assets/img/barrierhorizontal.png");
    game.load.image("barivert", "assets/img/barriervertical.png");
    game.load.image("hyperspacetop", "assets/img/hyperspacetop.png");
    game.load.image("hyperspacebottom", "assets/img/hyperspacebottom.png");
		game.load.spritesheet("red", "assets/img/barrier0.png", 25, 120);
		game.load.spritesheet("orange", "assets/img/barrier1.png", 25, 120);
		game.load.spritesheet("yellow", "assets/img/barrier2.png", 25, 120);
		game.load.spritesheet("green", "assets/img/barrier3.png", 25, 120);
		game.load.spritesheet("blue", "assets/img/barrier4.png", 25, 120);
		game.load.spritesheet("purple", "assets/img/barrier5.png", 25, 120);
    game.load.spritesheet("dude", "assets/img/playerspritesall.png", 59, 29);
    game.load.audio('menu', 'assets/audio/weirdloop.wav');
    game.load.audio('menu', 'assets/audio/dashrunner.wav');
    game.load.audio('menu', 'assets/audio/arcadefunk.mp3');
  },

  create: function () {
    game.state.start("menu");
  }
}
