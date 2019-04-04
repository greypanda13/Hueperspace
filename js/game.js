const GAME_HEIGHT = 600;

var game = new Phaser.Game(800, GAME_HEIGHT, Phaser.AUTO, "gameholder");

console.log("game.js initialized");

game.state.add("boot", bootState);
game.state.add("load", loadState);
game.state.add("menu", menuState);
game.state.add("play", playState);
game.state.add("gameover", gameoverState);

game.state.start("boot");
