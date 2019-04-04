# ProjectOne
Project 1 (Phaser)

Technologies used:
-minimal HTML, CSS
-Javascript with Phaser 2 game framework

Approach taken:
My game is centered around game phases. Phase 0 is the beginning, where player can traverse the whole screen but must avoid touching any barriers of a different color than player's spaceship. Phase 1 is hyperspace mode--concept is generally the same insofar as avoiding barriers. What's different: player's movements are (mostly) faster; maneuverable vertical space is limited; barriers approach faster. Because all of the major game aspects remain the same, most changes can be implemented with the use of coefficients (I used one each for barrier velocity, player velocity) and references to global array variables which hold relevant values in the gamephase# index position (i.e. the globally defined `const barriersPerSpawn = [5, 2];`--as there spawn 5 barriers per group during game phase 0 and 2 barriers per group during game phase 1).

Installation instructions:
Navigate to the URL for my web-hosted game! (URL to come)
Note: you will have to have access to the internet to play this game, unless you download the Phaser 2 framework to your own computer and properly link it in the code before gameplay. If you choose this route you must also have set up a local HTTP server.

Unsolved problems:
1. Refactorment for code involving:
    -switching game phases
    -spawning barrier groups in different game phases
2. Making the game scalable? Probably not at all possible using this framework/HTML5 canvas.
3. Chain animations after one another without initializing so many variables as timekeepers.

Time Management:

------Percent------
05% planning
30% basic function algorithm for barrier generation
30% game modes creation, transition work
30% visual/audio creation/adjustment
05% fine tuning of mechanics

----Hours----
03/28:  2hrs
03/30:  1hr
03/31:  1hr
04/01:  5hrs
04/02:  8hrs
04/03: 16hrs
Total:~33hrs



-----GOALS-----
MVP:
1. (X) ship solid color
2. (X) moves through solid black background
3. (X) colored barriers approach player side of screen
{(randomly generated?) array of toPullFrom off-screen to the right}
{grab toPullFrom[0] out of the array and give it per-frame leftward movement}
{once they reach off-screen left, add back to toPullFrom array}
4. (X) running into barriers which are a different color than your ship three times ends the game
{collision detection for all barriers}
{if collided barrier is same color as ship, do nothing}
{if collided barrier is different color, decrease health}
{if health less than 1, endGame function}
5. (X) counter for time increments to calculate score
{add 1pt every second}
6. (X) score display
7. (X) game over banner with the session's high score
{call from endGame(). draw over board}

BONUS:
1. (X) more than simple background
2. (X) moving background
3. ( ) parallax background
4. (X) include hyperspace mode ― essentially the lightning round at the end of each level/segment. vertically screen-covering barriers approach. top half is player color, bottom half is another. screen graphics become erratic and vertical movement is limited to a slimmer portion
5. sfx upon hitting player color barrier
6. ( ) boss battle
7. ( ) lvl 2 / alt game type
8. (X) make ship flicker upon collision
