//Game code
//Start game. Populate meta game board with numbers. Add score as player traverses the board.
//Numbers must be Negative and Positive.
//Get off the board with the number of moves remaining and maximum score.
//At every step show maximum possible score (Will require max_score algorithm)
//Have option to expose board that shows path with maximum score.

$(document).ready(function () {

	/*Need to decide color codes for tiles*/
	var FPS = 30;
	var meta_gameboard = [];
	var move_tracker = [];
	var gameboard = document.getElementById("gameboard");
	gameboard.width = $(window).width() - $("#info").width();
	gameboard.height = $(window).height();
	var canvas = gameboard.getContext("2d");
	var col_side = Math.floor(($(window).width() - $("#info").width())/31);
	var row_side = Math.floor($(window).height()/17);
	var row_limit = 17;
	var col_limit = 31;
	var row = 8; //Since counts start from 0, limit(median) - 1 
	var col = 15;
	var gamestarted = false;
	var score = 0;
	var fl = 0;
	var moves = 50;
	canvas.font = "italic 100px Helvetica";
	canvas.fillStyle = "White";

	canvas.fillText("Dare il", col*col_side - 137, row*row_side - 50);	
	colorTile(canvas, row, col, "#3366CC", row_side, col_side);
	canvas.fillStyle = "White";
	canvas.fillText("Gambetto", col*col_side - 207, row*row_side + 150);

	$("#playbutton").click(function() {
		startGame();
	});
	


	function startGame() {
		score = 0;
		moves = 50;
		row = 8;
		col = 15;
		canvas.fillStyle = "#FF0000";
		gamestarted = true;
		populateGameBoard();
		console.log(meta_gameboard);
		console.log(move_tracker);
		setInterval(function() {
			//gameboard.width = $(window).width() - $("#info").width();
			//gameboard.height = $(window).height();
			var col_side = Math.floor(($(window).width() - $("#info").width())/31);
			var row_side = Math.floor($(window).height()/17);
			if (gamestarted) {
				update();
				record_move();

  				draw();
  				display_occupied_spots();
  				if (moves <= 0) {
					gamestarted = false;
					canvas.fillStyle = "black";
					canvas.fillRect(0, 0, col_side*31, row_side*17);
					canvas.fillStyle = "White";

					canvas.fillText("Game", 15*col_side - 127, 8*row_side - 50);	
					colorTile(canvas, 8, 15, "#3366CC", row_side, col_side);
					canvas.fillStyle = "White";
					canvas.fillText("Over", 15*col_side - 95, 8*row_side + 150);
				}
			}
		}, 1000/FPS);
	}

	

	//changePhase();
	
	//setInterval(colorTileRepeat(canvas, row, col, "#FF0000", "#3366CC", fl, side), 1000);
	//setInterval(canvas.fillText("Score:" + score, side*24, 300), 500);
	//setInterval(changePhase(), 200);

	$(document).keydown(function(key) {
		if (gamestarted) {
			switch (parseInt(key.which,10)) {
			case 37: //left
				if (col > 0) {
					if (!move_tracker[row][col-1]) {
						score += meta_gameboard[row][--col];
						moves--;
					}
				}
				break;
			case 38: //up
				if (row > 0) {
					if (!move_tracker[row-1][col]) {
						score += meta_gameboard[--row][col];
						moves--;
					}
				}
				break;
			case 39: //right
				if (col < col_limit - 1) {
					if (!move_tracker[row][col+1]) {
						score += meta_gameboard[row][++col];
						moves--;
					}
				}
				break;
			case 40: //down
				if (row < row_limit- 1) {
					if (!move_tracker[row+1][col]) {
						score += meta_gameboard[++row][col];
						moves--;
					}
				}
				break;
			}
		}
		//console.log(row);
		//console.log(col);
	});

	function changePhase() {
		requestAnimationFrame(changePhase);
		if (fl == 1) {
			fl = 0;
			colorTile(canvas, 10, 7, "#3366CC", col_side);
		}
		else {
			fl = 1;
			colorTile(canvas, 10, 7, "#FF0000", col_side);
		}
	}

	function update() {
		updateScore();
	}

	function draw() {
		//var side = $(window).width()/30;
		drawBoard(canvas, row_limit, col_limit, row_side, col_side);
		colorTile(canvas, row, col, "#3366CC", row_side, col_side);
		displayGambit(row, col, canvas, row_side, col_side, meta_gameboard);
	}

	function updateScore() {
		$("#score").text("Score: " + score);
		$("#movesleft").text("Moves Left: " + moves);
	}



	function populateGameBoard() {
		for (i = 0; i < row_limit; i++) {
			meta_gameboard[i] = new Array(31);
			move_tracker[i] = new Array(31);
			for (j = 0; j < col_limit; j++) {
				meta_gameboard[i][j] = getRandomNumber(-100, 100);
				move_tracker[i][j] = false;
			}
		}
	}

	function record_move() {
		move_tracker[row][col] = true;
	}

	function display_occupied_spots() {
		for (i = 0; i < row_limit; i++) {
			for (j = 0; j < col_limit; j++) {
				if (move_tracker[i][j] == true) {
					colorTile(canvas, i, j, "#3366CC", row_side, col_side);
				}
			}
		}
	}

});

function drawBoard(context, rows, columns, rside, cside) {
	var counter = 0;
	context.fillStyle = "#FFFFDA";
	for (i = 0; i < rows; i++) {
		// if (counter == 0) {   //block important for grid creation if limits are even
		//  	context.fillStyle = "#404040";	
		//  	counter = 1;
		// }
		// else {
		//  	context.fillStyle = "#CC3333";
		//  	counter = 0;
		// }
		for (j = 0; j < columns; j++) {
		 	context.fillRect(j*cside, i*rside, cside, rside);		
		 	if (counter == 0) {
		 		context.fillStyle = "#404040";	
		 		counter = 1;
		 	}
		 	else {
		 		context.fillStyle = "#FFFFDA";
		 		counter = 0;
		 	}
		}
	}
}

function displayGambit(i, j, context, rside, cside, mgb) {

	if (i <= 0) {

	}
	else if (mgb[i-1][j] <= 25 && mgb[i-1][j] >= -5) {
		colorTile(context, i-1, j, "#7FFF00", rside, cside);
	}
	else if (mgb[i-1][j] <= -50 || mgb[i-1][j] >= 65) {
		colorTile(context, i-1, j, "#FF3300", rside, cside);
	}
	else {
		colorTile(context, i-1, j, "#FFA500", rside, cside);
	}

	if (j <= 0) {

	}
	else if (mgb[i][j-1] <= 25 && mgb[i][j-1] >= -5) {
		colorTile(context, i, j-1, "#7FFF00", rside, cside);
	}
	else if (mgb[i][j-1] <= -50 || mgb[i][j-1] >= 65) {
		colorTile(context, i, j-1, "#FF3300", rside, cside);
	}
	else {
		colorTile(context, i, j-1, "#FFA500", rside, cside);
	}

	if (i >= 16) {

	}
	else if (mgb[i+1][j] <= 25 && mgb[i+1][j] >= -5) {
		colorTile(context, i+1, j, "#7FFF00", rside, cside);
	}
	else if (mgb[i+1][j] <= -50 || mgb[i+1][j] >= 65) {
		colorTile(context, i+1, j, "#FF3300", rside, cside);
	}
	else {
		colorTile(context, i+1, j, "#FFA500", rside, cside);
	}

	if (j >= 30) {

	}
	else if (mgb[i][j+1] <= 25 && mgb[i][j+1] >= -5) {
		colorTile(context, i, j+1, "#7FFF00", rside, cside);
	}
	else if (mgb[i][j+1] <= -50 || mgb[i][j+1] >= 65) {
		colorTile(context, i, j+1, "#FF3300", rside, cside);
	}
	else {
		colorTile(context, i, j+1, "#FFA500", rside, cside);
	}
}

function colorTile(context, row, column, color, rside, cside) {
	context.fillStyle = color;
	context.fillRect(column*cside, row*rside, cside, rside);
}

function colorTileRepeat(context, row, column, color, color2, side, phase) {
	
	if (phase == 1) {
		context.fillStyle = color;
		context.fillRect(row*side, column*side, side, side);
		phase = 0;
	}	
	else {
		context.fillStyle = color2;
		context.fillRect(row*side, column*side, side, side);
		phase = 1;
	}
}

function getRandomNumber(min, max) {
	var rand = min + Math.random()*(max+1-min)
	rand = Math.floor(rand)
	return rand;
}
