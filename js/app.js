const canvasWidth = 505;
const canvasHeight = 480;
const fieldWidth = canvasWidth/5;
const fieldHeight = canvasHeight/6;
const playerWidth = 60;
const playerHeight = 70;
const enemyWidth = 60;
const enemyHeight = 70;
const gemWidth = 60;
const gemHeight = 40;
const canvas = document.querySelector('canvas');
const h1 = document.querySelector('h1');
const popup = document.querySelector('.popup_info');
const popupEnd = document.querySelector('.popup_end');
const counterPoints = document.querySelector('.game_eggs');
const gameTrophies = document.querySelector('.game_trophies');
const timer = document.querySelector('#timer');
const sound1 = document.querySelector('#sound1');
const sound2 = document.querySelector('#sound2');
const sound3 = document.querySelector('#sound3');

let points = 0;
let m = 0;
let s = 0;
let timeGoes = true;
let allEnemies = [];
let allRocks = [];
let position = [
	[110, (fieldWidth*0.2)],
	[110, (fieldWidth*1.2)],
	[110, (fieldWidth*2.2)],
	[110, (fieldWidth*3.2)],
	[110, (fieldWidth*4.2)],
	[190, (fieldWidth*0.2)],
	[190, (fieldWidth*1.2)],
	[190, (fieldWidth*2.2)],
	[190, (fieldWidth*3.2)],
	[190, (fieldWidth*4.2)],
	[275, (fieldWidth*0.2)],
	[275, (fieldWidth*1.2)],
	[275, (fieldWidth*2.2)],
	[275, (fieldWidth*3.2)],
	[275, (fieldWidth*4.2)],
];

position = shuffle(position);

h1.innerHTML = 'EASTER EGG';
popup.innerHTML = "Move egg by keys:<br><span class='yellow'>←</span> left, <span class='yellow'>↑</span> up, <span class='yellow'>→</span> right, <span class='yellow'>↓</span> down.<br><br>Put egg in water and take a small egg!<br>Then egg will be more colored ...<br><br><span class='yellow'>Be careful about chicken!</span><br>Collision with chicken put your egg at the begining and delets all small eggs!!<br><br><img src='images/smallRock.png'> gives  <img src='images/smallHeart.png'> and one <img src='images/smallGem_Blue.png'> or <img src='images/smallGem_Green.png'> or <img src='images/smallGem_Orange.png'>.<br>One gem gives one <img src='images/smallKey.png'> and delete one <img src='images/smallChicken.png'>!<br>Gather <img src='images/eggSmall.png'><img src='images/eggSmall.png'><img src='images/eggSmall.png'><img src='images/eggSmall.png'><img src='images/eggSmall.png'><img src='images/eggSmall.png'>and won game!<br><br><span class='yellow'>GOOD LUCK!</span><br><br><br><span class='info'>Press <span class='green'>ENTER</span> to start game!</span>";

// Enemies our player must avoid
let Enemy = function(x, y, move, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
	this.x = -100;
	this.y = y;
	this.move = (Math.random() * 120) + 70;
    this.sprite = 'images/enemy-chicken.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

	this.x = this.x + (this.move * dt);

	if(this.x > canvasWidth){
		this.x = -100;
	}

	/* colision */
 	if(player.x < (this.x + enemyWidth) && (player.x + playerWidth) > this.x && player.y < (this.y + enemyHeight) &&
	  (player.y + playerHeight) > this.y){
		setTimeout(function(){
			player.x = 2*fieldWidth;
			player.y = 5*fieldHeight;
		}, 200);


		let soundEffect1 = true;

		//Play sound1

		if(soundEffect1){
			sound1.pause();
			sound1.currentTime = 0;
			sound1.play();
			soundEffect1 = false;
		}

		if(points > 0){
			points = 0;
			counterPoints.innerHTML = '';
		}
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Shuffle an elements in array
* @constructor
* @param {array} array - The array which elements will be shuffled
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
};

let enemyX = Math.floor(Math.random() * 450) + 200;
let enemyY = [70, 153, 233, 70, 153, 233, 70, 153, 233];
let enemyMove = Math.floor(Math.random() * 100) + 50;

allEnemies = shuffle(allEnemies);

enemyY.forEach(function (enemyY) {
	enemy = new Enemy(enemyX, enemyY, enemyMove);
	allEnemies.push(enemy);
});

let Trophy = function(x, y, sprite) {
	this.x = x;
	this.y = y;
	/* this.sprite = 'images/Rock.png'; */
	this.sprite = sprite;
};

Trophy.prototype.update = function(dt) {
};

// Draw the gems on the screen, required method for game
Trophy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

let rockSprite = 'images/Rock.png';

allRocks = shuffle(allRocks);

let rock1 = new Trophy(position[0][1], position[0][0], rockSprite);
let rock2 = new Trophy(position[1][1], position[1][0], rockSprite);
let rock3 = new Trophy(position[2][1], position[2][0], rockSprite);

allRocks.push(rock1, rock2, rock3);

let gemsSprite = ['images/Gem_Orange.png', 'images/Gem_Blue.png', 'images/Gem_Green.png'];

let allGems = [];
allGems = shuffle(allGems);
gemsSprite = shuffle(gemsSprite);

let gem1 = new Trophy();
let gem2 = new Trophy();
let gem3 = new Trophy();

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function(x, y, sprite) {
	this.x = x;
	this.y = y;
	this.sprite = 'images/egg1.png';
};

function startGame(){
	popup.style.display = 'none';
	popupEnd.style.display = 'none';
	counterPoints.innerHTML = '';
	gameTrophies.innerHTML = '';
	points = 0;
	timerGameStart();
};

function rocksCollision(){
	img = new Image();
	img.onload = function() {
		gameTrophies.appendChild(img);
	};
	img.src = 'images/smallHeart.png';

	let soundEffect2 = true;

	//Play sound2

	if(soundEffect2){
		sound2.pause();
		sound2.currentTime = 0;
		sound2.play();
		soundEffect2 = false;
	}
};

Player.prototype.update = function(dt){

	if(this.x < rock1.x + gemWidth && this.x + playerWidth > rock1.x && this.y < rock1.y + gemHeight && this.y + playerHeight > rock1.y){
		rocksCollision();
		gem1 = new Trophy(position[3][1], position[3][0], gemsSprite[0]);
		allGems.push(gem1);
		rock1.x = -900;
	};

	if(this.x < rock2.x + gemWidth && this.x + playerWidth > rock2.x && this.y < rock2.y + gemHeight && this.y + playerHeight > rock2.y){
		rocksCollision();
		gem2 = new Trophy(position[4][1], position[4][0], gemsSprite[1]);
		allGems.push(gem2);
		rock2.x = -900;
	};

	if(this.x < rock3.x + gemWidth && this.x + playerWidth > rock3.x && this.y < rock3.y + gemHeight && this.y + playerHeight > rock3.y){
		rocksCollision();
		gem3 = new Trophy(position[5][1], position[5][0], gemsSprite[2]);
		allGems.push(gem3);
		rock3.x = -900;
	};

	if(this.x < gem1.x + gemWidth && this.x + playerWidth > gem1.x && this.y < gem1.y + gemHeight && this.y + playerHeight > gem1.y){
		gem1.x = -900;
		delete allEnemies[0];
		gemsCollision();
	};

	if(this.x < gem2.x + gemWidth && this.x + playerWidth > gem2.x && this.y < gem2.y + gemHeight && this.y + playerHeight > gem2.y){
		gem2.x = -900;
		delete allEnemies[4];
		gemsCollision();
	};

	if(this.x < gem3.x + gemWidth && this.x + playerWidth > gem3.x && this.y < gem3.y + gemHeight && this.y + playerHeight > gem3.y){
		gem3.x = -900;
		delete allEnemies[8];
		gemsCollision();
	};
};

function gemsCollision(){
	img2 = new Image();
	img2.onload = function() {
		 gameTrophies.appendChild(img2);
	};
	img2.src = 'images/smallKey.png';

	let soundEffect3 = true;

	//Play sound2

	if(soundEffect3){
		sound3.pause();
		sound3.currentTime = 0;
		sound3.play();
		soundEffect3 = false;
	}
};


Player.prototype.render = function(){
	 ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput = function(keyPress){

	if(keyPress == 'enter'){
	 	startGame();
	};

	if(keyPress == 'left' && this.x > 0){
		this.x -= fieldWidth;
	}else if(keyPress == 'left' && this.x < 0){
		this.x == 0;
	};

	if(keyPress == 'up' && this.y > 0){
		this.y -= fieldHeight;
	};

	if(keyPress == 'right' && this.x < (4*fieldWidth)){
		this.x += fieldWidth;
	}else if(keyPress == 'right' && this.x > (4*fieldWidth)){
		this.x == 4*fieldWidth;
	};

	if(keyPress == 'down' && this.y < (5*fieldHeight)){
		this.y += fieldHeight;
	}else if(keyPress == 'down' && this.y > (5*fieldHeight)){
		this.x == 5*fieldHeight;
	};

	if(keyPress == 'end'){
	 	reload();
	};

	if(this.y < 1){
		setTimeout(function(){
			player.x = 2*fieldWidth;
			player.y = 5*fieldHeight;
		}, 300);

		if(points < 7){
			points = points + 1;
			counterPoints.innerHTML += "<img class='star' src='images/eggSmall.png'>";
		};

		if(points == 0){this.sprite = 'images/egg1.png';};
		if(points == 1){this.sprite = 'images/egg2.png';};
		if(points == 2){this.sprite = 'images/egg3.png';};
		if(points == 4){this.sprite = 'images/egg4.png';};
		if(points == 5){this.sprite = 'images/egg5.png';};
		if(points == 6){
			this.sprite = 'images/egg6.png';
			gameOver();
		};
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies

// Place the player object in a variable called player
let player = new Player (2*fieldWidth, 5*fieldHeight);


// This listens for key presses and sends the keys to you6r
// Player.handleInput() method. You don't need to modify this.
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
* @constructor
*/
function timerGameStart(){
	setInterval('count()', 1000);
};


/**
* @description Stop game timer
* @constructor
*/
function timerGameStop(){
	timeGoes == false;
};

/**
* @description Count time of game
* @constructor
*/
function count(){
	if(timeGoes == true){
		s.value = s;
		m.value = m;

		s++;

		if(s == 60){
			m++;
			s = 0;
		}
	}else{
		s = 0;
		m = 0;
	}
	timer.innerHTML = 'Time: ' + m + ' min ' + s + ' sec';
};


function reload(){
	window.location.reload();
};

function gameOver(){
	let gameTime = m + ' min ' + s + ' sec';

	popupEnd.style.display = 'block';

	popupEnd.innerHTML = "<span class='yellow'>CONGRATULATION! YOU WON!</span><br><br>Your game time: <span class='yellow'>" + gameTime + "</span> :) <br><br><img src='images/eggs.png' alt='Easter Egge'><br><br><span class='infoEnd'>Press <span class='green'>END</span> key<br/>to refresh game!</span>";

	// TODO: set value of variable timeGoes to false and stop the timer
	timeGoes = false;

	// TODO: set time on 0
	timer.style.display = 'none';

};

