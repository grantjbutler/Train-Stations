//Canvas and context
var canvas, context;
//Variables for keeping track of time change between update calls
var then, now;
//Game State
var state = "load"; //Three primary states are 'load', 'game', and 'menu'

//Buttons
var buttons = [];

//Tiles
var tiles = new Array(15);
for(var i=0; i < tiles.length; i++) {
	tiles[i] = new Array(10);
}

//Prices of tickets
var ticketPrices = {
	normal : 5,
	cafe : 10,
	luxury : 20
};

//Arrays of things that need to be handled
var customers = [];
var trains = [];
var employees = {};
var platforms = [];
var trainSchedule = [];
var ticketBooths = []; 

//In-game time
var time = {
	month : 1,
	day : 1,
	year : 2013,
	hour : 0,
	minute : 0
};

var renderFrame = (function() {
	return window.mozRequestAnimationFrame ||
		   window.msRequestAnimationFrame ||
		   window.webkitRequestAnimationFrame ||
		   window.requestAnimationFrame ||
		   function(func) {
			   setTimeout(func, 1000 / 60);
		   };
})().bind(window);

//Set up the game when the window loads
window.onload = function() {
	canvas = document.getElementById("game");
	context = canvas.getContext("2d");
	//Attach listeners
	canvas.addEventListener('mousedown', function(e) { mouseDown(e) }, false);
	canvas.addEventListener('mouseup', function(e) { mouseUp(e) }, false);
	makeMenuButtons(); 
	then = Date.now();
	renderFrame(main);
};

//the main game loop
var main = function() {
	now = Date.now() - then;
	update(now/1000);
	draw();
	renderFrame(main);
}

//Primary update methods
var update = function(modifier) {
	switch(state) {
		case 'load':
		
		break;
		
		case 'menu':
		updateMenu();
		break;
		
		case 'game':
		updateGame();
		break;
	}
}

function updateMenu() {
	
}

function updateGame() {

}

//Input Handle
function mouseDown(event) {

}

function mouseUp(event) {

}

//Primary draw methods
var draw = function() {
	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillStyle = "#6495ED";
	context.fillRect(0,0,canvas.width, canvas.height);
	switch(state) {
		case 'load':
		drawLoad();
		break;
		
		case 'menu':
		drawMenu();
		break;
		
		case 'game':
		drawGame();
		break;
	}
}

function drawLoad() {

}

function drawMenu() {

}

function drawGame() {

}

//Creation of objects
function createBaseGame() {
	platforms = new Array(3);
	for(var i=0;i < platforms.length; i++) {
		platforms[i] = {};
		platforms[i].active = false;
		//platforms.
	}
	platforms[0].active = true;
	tracks = new Array(6);
	for(var i=0;i < tracks.length; i++) {
		tracks[i] = {};
		tracks[i].active = false;
		tracks[i].trainDocked = -1; //No train is at the station
		//platforms.
	}
	tracks[0].active = true;
	
	//temp train
	var tempTrain = { isTraveling : false, x : 0, y : 0, spd : 0, platform : 0, timeToReturn : 0 };
	trains.push(tempTrain);
	
	//Single employee
	var tempEmployee = {salary : 1000, customerQueue : [], isWorking : false};
}

function addPlatform() {
	if (platforms[1].active == false) {
		platforms[1].active = true;
		return true;
	} else if (platforms[2].actve == false) {
		platforms[2].active
		return true;
	} else {
		return false;
	}
}

function addTrack() {
	for (var i=0; i < platforms.length; i++) {
		if (platforms[i].active) {
			for (var j=0;j < tracks.length; j++) {
				if (tracks[j].active == false) {
					tracks[j].active = true;
					return true;
				}
			}
		}
	}
	return false;
}

function makeMenuButtons() {
	buttons = [];
	var button = {x:20,y:20,text:"Play",width:context.measureText("Play").width, height:24,
		method : function() {
			state = "game";
			createGameButtons();
		}
	};
	buttons.push(button);
	var button = {x:20,y:50,text:"Options",width:context.measureText("Options").width, height:24,
		method : function() {

		}
	};
}