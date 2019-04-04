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
