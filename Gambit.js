//Game code
//Start game. Populate meta game board with numbers. Add score as player traverses the board.
//Numbers must be Negative and Positive.
//Get off the board with the number of moves remaining and maximum score.
//At every step show maximum possible score (Will require max_score algorithm)
//Have option to expose board that show path with maximum score.

$(document).ready(function () {

	/*Need to decide color codes for tiles*/
	var FPS = 30;
	var meta_gameboard = [];
	var gameboard = document.getElementById("gameboard");
	gameboard.width = $(window).width() - $("#info").width();
	gameboard.height = $(window).height();
	var canvas = gameboard.getContext("2d");
	var col_side = ($(window).width() - $("#info").width())/30;
	var row_side = $(window).height()/16;
	var row_limit = 16;
	var col_limit = 30;
	var row = 7;
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
		row = 7;
		col = 15;
		canvas.fillStyle = "#FF0000";
		gamestarted = true;
		populateGameBoard();
		console.log(meta_gameboard);
		setInterval(function() {
			var col_side = ($(window).width() - $("#info").width())/30;
			var row_side = $(window).height()/16;
			if (gamestarted) {
				update();
  				draw();
  				if (moves <= 0) {
					gamestarted = false;
					canvas.fillStyle = "black";
					canvas.fillRect(0, 0, col_side*30, row_side*16);
					canvas.fillStyle = "White";

					canvas.fillText("Game", 15*col_side - 127, 7*row_side - 50);	
					colorTile(canvas, 7, 15, "#3366CC", row_side, col_side);
					canvas.fillStyle = "White";
					canvas.fillText("Over", 15*col_side - 95, 7*row_side + 150);
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
					score += meta_gameboard[row][--col];
					moves--;
				}
				break;
			case 38: //up
				if (row > 0) {
					score += meta_gameboard[--row][col];
					moves--;
				}
				break;
			case 39: //right
				if (col < col_limit - 1) {
					score += meta_gameboard[row][++col];
					moves--;
				}
				break;
			case 40: //down
				if (row < row_limit- 1) {
					score += meta_gameboard[++row][col];
					moves--;
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
		//displayGambit(row, col, canvas, side);
	}

	function updateScore() {
		$("#score").text("Score: " + score);
		$("#movesleft").text("Moves Left: " + moves);
	}



	function populateGameBoard() {
		for (i = 0; i < row_limit; i++) {
			meta_gameboard[i] = new Array(30);
			for (j = 0; j < col_limit; j++) {
				meta_gameboard[i][j] = getRandomNumber(-100, 100);
			}
		}
	}

	function reset() {

	}
});

function drawBoard(context, rows, columns, rside, cside) {
	var counter = 0;
	for (i = 0; i < rows; i++) {
		if (counter == 0) {
		 	context.fillStyle = "#404040";	
		 	counter = 1;
		}
		else {
		 	context.fillStyle = "#CC3333";
		 	counter = 0;
		}
		for (j = 0; j < columns; j++) {
		 	context.fillRect(j*cside, i*rside, cside, rside);		
		 	if (counter == 0) {
		 		context.fillStyle = "#404040";	
		 		counter = 1;
		 	}
		 	else {
		 		context.fillStyle = "#CC3333";
		 		counter = 0;
		 	}
		}
	}
}

function displayGambit(i, j, context, side) {
	colorTile(context, i-1, j, "#7FFF00", side);
	colorTile(context, i, j-1, "#7FFF00", side);
	colorTile(context, i+1, j, "#7FFF00", side);
	colorTile(context, i, j+1, "#7FFF00", side);
	colorTile(context, i-1, j+1, "#FFA500", side);
	colorTile(context, i-1, j-1, "#FFA500", side);
	colorTile(context, i+1, j+1, "#FFA500", side);
	colorTile(context, i+1, j-1, "#FFA500", side);
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

function callGambit(gambit) {
	switch(gambit) {
		case 1:
			return 1;
		case 2:
			if (getRandomNumber() >= 0.5) {
				return 1;
			}
			else {
				return 0;
			}
		case 3:
			if (getRandomNumber() >= 0.7) {
				return 1;
			}
			else {
				return 0;
			}
		case 4:
			if (getRandomNumber() >= 0.95) {
				return 1;
			}
			else {
				return 0;
			}
	}
}

// function callGambit() {
// 	var prob = 0;
// 	//add probability code

// 	switch () {
// 		case 1:
// 		 	break;
// 		case 2:
// 		 	break;
// 		case 3:
// 		 	break;
// 		case 4:
// 		 	break;
// 		case 5:
// 		 	break;
// 		case 6:
// 		 	break;
// 		case 7:
// 		 	break;
// 		case 8:
// 		 	break;
// 	}
// }