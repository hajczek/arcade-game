/* jshint esversion: 6 */

const CANVAS_WIDTH = 505;
const CANVAS_HEIGHT = 480;
const FIELD_WIDTH = CANVAS_WIDTH/5;
const FIELD_HEIGHT = CANVAS_HEIGHT/6;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 70;
const ENEMY_WIDTH = 60;
const ENEMY_HEIGHT = 70;
const GEM_WIDTH = 60;
const GEM_HEIGHT = 40;

const canvas = document.querySelector("canvas");
const h1 = document.querySelector("h1");
const popup = document.querySelector(".popup_info");
const popupEnd = document.querySelector(".popup_end");
const counterPoints = document.querySelector(".game_eggs");
const gameTrophies = document.querySelector(".game_trophies");
const timer = document.querySelector("#timer");
const sound1 = document.querySelector("#sound1");
const sound2 = document.querySelector("#sound2");
const sound3 = document.querySelector("#sound3");
const sound4 = document.querySelector("#sound4");
const sound5 = document.querySelector("#sound5");
const sound6 = document.querySelector("#sound6");

let points = 0;
let m = 0;
let s = 0;
let timeGoes = true;
let allEnemies = [];
let allRocks = [];

// Array with all positions on canvas.
let position = [
	[110, (FIELD_WIDTH*0.2)],
	[110, (FIELD_WIDTH*1.2)],
	[110, (FIELD_WIDTH*2.2)],
	[110, (FIELD_WIDTH*3.2)],
	[110, (FIELD_WIDTH*4.2)],
	[190, (FIELD_WIDTH*0.2)],
	[190, (FIELD_WIDTH*1.2)],
	[190, (FIELD_WIDTH*2.2)],
	[190, (FIELD_WIDTH*3.2)],
	[190, (FIELD_WIDTH*4.2)],
	[275, (FIELD_WIDTH*0.2)],
	[275, (FIELD_WIDTH*1.2)],
	[275, (FIELD_WIDTH*2.2)],
	[275, (FIELD_WIDTH*3.2)],
	[275, (FIELD_WIDTH*4.2)]
];

// Shuffles the elements in array position.
position = shuffle(position);

h1.innerHTML = "EASTER EGG";

popup.innerHTML = "Move egg by keys:<br><span class='yellow'>←</span> left, <span class='yellow'>↑</span> up, <span class='yellow'>→</span> right, <span class='yellow'>↓</span> down.<br><br>Put egg to water and get a small egg! Then your egg will be more colored ...<br><br><span class='yellow'>Be careful about chicken!</span><br>Collision with chicken put your egg at the begining and deletes all small eggs!!<br><br><img src='images/smallRock.png'> gives  <img src='images/smallHeart.png'> and one <img src='images/smallGem_Blue.png'> or <img src='images/smallGem_Green.png'> or <img src='images/smallGem_Orange.png'>.<br>One gem gives one <img src='images/smallKey.png'> and delete one <img src='images/smallChicken.png'>!<br>Gather <img src='images/eggSmall.png'><img src='images/eggSmall.png'><img src='images/eggSmall.png'><img src='images/eggSmall.png'><img src='images/eggSmall.png'><img src='images/eggSmall.png'>and won game!<br><br><span class='yellow'>GOOD LUCK!</span><br><br><br><span class='info'>Press <span class='green'>ENTER</span> to start game!</span>";


/** Class representing a characters in game. */
class Characters {
	/**
	 * Create a characters.
     * @param {number} x - Characters position on X axis.
	 * @param {variable} y - Characters position on Y axis.
	 * @param {number} move - Characters's move on X axis.
	 * @param {string} sprite - Path to graphic file with Characters.
     */
	constructor(x = 0, y = 0, move = 0, sprite = '') {
		this.x = x;
		this.y = y;
		this.sprite = sprite;
		this.move = move;
	}

	// Drawes the character on the screen, required method for game.
	render() {
    	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

/**
 * Class representing an Enemy.
 * @extends Characters
 */
class Enemy extends Characters {
	/**
	 * Create an Enemy.
	 * @param {number} x - Enemy position on X axis.
	 * @param {variable} y - Enemy position on Y axis.
 	 * @param {number} move - Enemy's move on X axis.
	 * @param {string} sprite - Path to graphic file with Enemy.
  	 */
	constructor(x, y, move, sprite) {
		super(x, y, move, sprite);
		this.x = -100;
		this.y = y;
		this.move = (Math.random() * 120) + 70;
		this.sprite = "images/enemy-chicken.png";
	}

	// Updates the Enemy. Sets dt parameter for update Enemy - a time delta between ticks.
	update(dt) {

		// Multiplies a movement by the dt parameter. This ensure the game runs at the same speed for all computers.
		this.x = this.x + (this.move * dt);

		// Puts Enemy on a start position if actual position of Enemy is bigger than width of canvas.
		if(this.x > CANVAS_WIDTH) {
			this.x = -100;
		}

		// Puts player on initial place after collision with Enemy.
		if(player.x < (this.x + ENEMY_WIDTH) && (player.x + PLAYER_WIDTH) > this.x && player.y < (this.y + ENEMY_HEIGHT) && (player.y + PLAYER_HEIGHT) > this.y) {
			player.x = 2*FIELD_WIDTH;
			player.y = 5*FIELD_HEIGHT;

			// Sets player sprite on start image.
			player.sprite = "images/egg1.png";

			// Adds a sound1.
			let soundEffect1 = true;

			// Plays sound1.
			if(soundEffect1) {
				sound1.pause();
				sound1.currentTime = 0;
				sound1.play();
				soundEffect1 = false;
			}

			// Deletes all points.
			if(points > 0) {
				points = 0;
				counterPoints.innerHTML = "";
			}
		}
	}
}



/**
* @description Shuffle an elements in array.
* @param {array} array - The array which elements will be shuffled.
*/
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


// Position on asix X for an Enemies.
let enemyX = Math.floor(Math.random() * 450) + 200;

// Array with positions on asix Y for an Enemies.
let enemyY = [70, 153, 233, 70, 153, 233, 70, 153, 233];

// Speed of move for Enemies.
let enemyMove = Math.floor(Math.random() * 100) + 50;

let enemySprite = "images/enemy-chicken.png";

// Creates an enemies and adds to array.
enemyY.forEach(function (enemyY) {
	enemy = new Enemy(enemyX, enemyY, enemySprite);
	allEnemies.push(enemy);

	// Shuffles elements in array with all enemies.
	allEnemies = shuffle(allEnemies);
});


/**
 * Class representing an Trophy.
 * @extends Characters
 */
class Trophy extends Characters {
	/**
	 * Create a Trophy.
	 * @param {number} x - Trophy position on X axis.
	 * @param {variable} y - Trophy position on Y axis.
	 * @param {string} sprite - Path to graphic file with Trophy.
  	 */
	constructor(x, y, sprite) {
		super(x, y, sprite);
		this.x = x;
		this.y = y;
		this.sprite = sprite;
	}

	// Draws the trophys on the screen.
	render() {
    	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

// Sets the path to graphic file for rocks  trophy.
let rockSprite = "images/Rock.png";

// Sets 3 rocks on canvas.
let rock1 = new Trophy(position[0][1], position[0][0], rockSprite);
let rock2 = new Trophy(position[1][1], position[1][0], rockSprite);
let rock3 = new Trophy(position[2][1], position[2][0], rockSprite);

// Adds all rocks to array.
allRocks.push(rock1, rock2, rock3);

// Shuffles all elements in array with rocks.
allRocks = shuffle(allRocks);

// Sets the path to graphic file for gems trophy.
let gemsSprite = ["images/Gem_Orange.png", "images/Gem_Blue.png", "images/Gem_Green.png"];

// Creates an array for all gems.
let allGems = [];

// Shuffles all elements in array with gems.
allGems = shuffle(allGems);

// Shuffles all elements in array with sprite of gems.
gemsSprite = shuffle(gemsSprite);

// Sets 3 gems on canvas.
let gem1 = new Trophy();
let gem2 = new Trophy();
let gem3 = new Trophy();


/**
 * Class representing an Player.
 * @extends Characters
 */
class Player extends Characters {
	/**
	 * Create a Player.
	 * @param {number} x - Player position on X axis.
	 * @param {variable} y - Player position on Y axis.
	 * @param {string} sprite - Path to graphic file with Player.
  	 */
	constructor(x, y, sprite) {
		super(x, y, sprite);
		this.x = x;
		this.y = y;
		this.sprite = "images/egg1.png";
	}

	// Draws the player on the screen.
	render() {
		 ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}

	// Updates the Player.
	update() {
		// Adds new behaviours when player have collision with rocks.
		/* if(this.x < rock1.x + GEM_WIDTH && this.x + PLAYER_WIDTH > rock1.x && this.y < rock1.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > rock1.y) {
			rocksCollision();

			// Adds a gem1 to canvas.
			gem1 = new Trophy(position[3][1], position[3][0], gemsSprite[0]);

			// Adds a gem1 to array.
			allGems.push(gem1);

			// Sets a position on axis X on -900 for rock1.
			rock1.x = -900;
		} */

		if(this.x < rock2.x + GEM_WIDTH && this.x + PLAYER_WIDTH > rock2.x && this.y < rock2.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > rock2.y) {
			rocksCollision();

			// Adds a gem2 to canvas.
			gem2 = new Trophy(position[4][1], position[4][0], gemsSprite[1]);

			// Adds a gem2 to array.
			allGems.push(gem2);

			// Sets a position on axis X on -900 for rock2.
			rock2.x = -900;
		}

		if(this.x < rock3.x + GEM_WIDTH && this.x + PLAYER_WIDTH > rock3.x && this.y < rock3.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > rock3.y) {
			rocksCollision();

			// Adds a gem3 to canvas.
			gem3 = new Trophy(position[5][1], position[5][0], gemsSprite[2]);

			// Adds a gem3 to array.
			allGems.push(gem3);

			// Sets a position on axis X on -900 for rock3.
			rock3.x = -900;
		}

		// Adds new behaviours when player have collision with gems.
		if(this.x < gem1.x + GEM_WIDTH && this.x + PLAYER_WIDTH > gem1.x && this.y < gem1.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > gem1.y) {

			// Sets a position on axis X on -900 for gem1.
			gem1.x = -900;

			// Deletes element on position 0 from array with enemies.
			delete allEnemies[0];

			gemsCollision();
		}

		if(this.x < gem2.x + GEM_WIDTH && this.x + PLAYER_WIDTH > gem2.x && this.y < gem2.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > gem2.y) {

			// Sets a position on axis X on -900 for gem2.
			gem2.x = -900;

			// Deletes element on position 4 from array with enemies.
			delete allEnemies[4];

			gemsCollision();
		}

		if(this.x < gem3.x + GEM_WIDTH && this.x + PLAYER_WIDTH > gem3.x && this.y < gem3.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > gem3.y) {

			// Sets a position on axis X on -900 for gem3.
			gem3.x = -900;

			// Deletes element on position 8 from array with enemies.
			delete allEnemies[8];
			gemsCollision();
		}
	}

	// Handles keyPress event for player.
	handleInput(keyPress) {

		if((keyPress == 'left' || keyPress == 'right' || keyPress == 'down' || keyPress == 'up') && (this.x < rock1.x + GEM_WIDTH && this.x + PLAYER_WIDTH > rock1.x && this.y < rock1.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > rock1.y)){
			rocksCollision();

			// Adds a gem1 to canvas.
			gem1 = new Trophy(position[3][1], position[3][0], gemsSprite[0]);

			// Adds a gem1 to array.
			allGems.push(gem1);

			// Sets a position on axis X on -900 for rock1.
			rock1.x = -900;
		}

		// Start game when key Enter is press.
		if(keyPress == 'enter'){
			startGame();
		}

		// Move player to left when key Left is press but only if player position on axis X is bigger than 0.
		if(keyPress == 'left' && this.x > 0) {
			this.x -= FIELD_WIDTH;
		} else if (keyPress == 'left' && this.x < 0) {
			this.x === 0;
		}

		// Move player up when key Up is press but only if player position on axis Y is bigger than 0.
		if(keyPress == 'up' && this.y > 0) {
			this.y -= FIELD_HEIGHT;
		}

		// Move player to right when key Right is press but only if player position on axis X is smaller than 4*FIELD_WIDTH.
		if(keyPress == 'right' && this.x < (4*FIELD_WIDTH)) {
			this.x += FIELD_WIDTH;
		} else if (keyPress == 'right' && this.x > (4*FIELD_WIDTH)) {
			this.x == 4*FIELD_WIDTH;
		}

		// Move player down when key Down is press but only if player position on axis Y is smaller than 5*FIELD_HEIGHT.
		if(keyPress == 'down' && this.y < (5*FIELD_HEIGHT)) {
			this.y += FIELD_HEIGHT;
		} else if (keyPress == 'down' && this.y > (5*FIELD_HEIGHT)) {
			this.x == 5*FIELD_HEIGHT;
		}

		// Relod game when key End is press.
		if(keyPress == 'end') {
			reload();
		}

		// Move player on initial position when his position on axis Y is smaller than 0.
		if(this.y < 1) {
			this.x = 2*FIELD_WIDTH;
			this.y = 5*FIELD_HEIGHT;

			// Adds small egg when quantity of points are smaller than 7
			if(points < 7) {
				points = points + 1;
				counterPoints.innerHTML += "<img class='star' src='images/eggSmall.png'>";

				// Adds a sound5.
				let soundEffect5 = true;

				// Plays sound5.
				if(soundEffect5) {
					sound5.pause();
					sound5.currentTime = 0;
					sound5.play();
					soundEffect5 = false;
				}
			}

			// Changes the image of Player depending on quantity of points.
			if(points === 0) {this.sprite = "images/egg1.png";}
			if(points == 1) {this.sprite = "images/egg2.png";}
			if(points == 2) {this.sprite = "images/egg3.png";}
			if(points == 4) {this.sprite = "images/egg4.png";}
			if(points == 5) {this.sprite = "images/egg5.png";}

			// Ends game when quantity of point equal 6.
			if(points == 6) {
				this.sprite = "images/egg6.png";
				gameOver();

				// Adds a sound6.
				let soundEffect6 = true;

				// Plays sound6.
				if(soundEffect6) {
					sound6.pause();
					sound6.currentTime = 0;
					sound6.play();
					soundEffect6 = false;
				}
			}
		}
	}
}


/**
* @description Starts game
*/
function startGame(){
	popup.style.display = "none";
	popupEnd.style.display = "none";
	counterPoints.innerHTML = "";
	gameTrophies.innerHTML = "";
	points = 0;
	timerGameStart();
	sound4.loop = true;
	sound4.play();
}


/**
* @description Adds functionalities for player collision with rock.
*/
function rocksCollision(){

	// Adds heart image to canvas.
	img = new Image();
	img.onload = function() {
		gameTrophies.appendChild(img);
	};
	img.src = "images/smallHeart.png";

	// Adds a sound2.
	let soundEffect2 = true;

	// Plays sound2.
	if(soundEffect2){
		sound2.pause();
		sound2.currentTime = 0;
		sound2.play();
		soundEffect2 = false;
	}
}


/**
* @description Adds functionalities for player collision with gem.
*/
function gemsCollision() {

	// Adds key image to canvas.
	img2 = new Image();
	img2.onload = function() {
		 gameTrophies.appendChild(img2);
	};
	img2.src = "images/smallKey.png";

	// Adds a sound3.
	let soundEffect3 = true;

	// Plays sound3.
	if(soundEffect3){
		sound3.pause();
		sound3.currentTime = 0;
		sound3.play();
		soundEffect3 = false;
	}
}


// Sets player on initial position.
let player = new Player (2*FIELD_WIDTH, 5*FIELD_HEIGHT);


// Listens for key presses.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
		13: 'enter',
		35: 'end',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


/**
* @description Start game timer
*/
function timerGameStart() {
	setInterval('count()', 1000);
}


/**
* @description Stop game timer
*/
function timerGameStop() {
	timeGoes == false;
}


/**
* @description Count time of game
*/
function count(){
	if(timeGoes == true) {
		s.value = s;
		m.value = m;

		s++;

		if(s == 60){
			m++;
			s = 0;
		}
	} else {
		s = 0;
		m = 0;
	}
	timer.innerHTML = 'Time: ' + m + ' min ' + s + ' sec';
}


/**
* @description Reload the game.
*/
function reload() {
	window.location.reload();
}


/**
* @description Ends the game.
*/
function gameOver() {

	// Display game time.
	let gameTime = m + ' min ' + s + ' sec';

	// Displays congratulations on screen for player.
	popupEnd.style.display = 'block';
	popupEnd.innerHTML = "<span class='yellow'>CONGRATULATION! YOU WON!</span><br><br>Your game time: <span class='yellow'>" + gameTime + "</span> :) <br><br><img src='images/eggs.png' alt='Easter Egge'><br><br><span class='infoEnd'>Press <span class='green'>END</span> key<br/>to refresh game!</span>";

	// Sets value of variable timeGoes to false and stop the timer.
	timeGoes = false;

	// Sets game time on 0.
	timer.style.display = 'none';

	// Pauses music and set current Time on 0 for audio file.
	sound4.pause();
	sound4.currentTime = 0;

}
