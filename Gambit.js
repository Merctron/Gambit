//Game code
//Start game. Populate meta game board with numbers. Add score as player traverses the board.
//Numbers must be Negative and Positive.
//Get off the board with the number of moves remaining and maximum score.
//At every step show maximum possible score (Will require max_score algorithm)
//Have option to expose board that show path with maximum score.

$(document).ready(function () {

	/*Need to decide color codes for tiles*/

	var meta_gameboard = [];
	var gameboard = document.getElementById("gameboard");
	gameboard.width = $(window).width();
	//gameboard.style.width = $(window).width();
	gameboard.height = $(window).height();
	//gameboard.style.height = $(window).height();
	var canvas = gameboard.getContext("2d");
	var side = $(window).width()/30;
	var row = 15;
	var col = 7;

	var score = 0;
	var fl = 0;

	canvas.fillStyle = "#FF0000";
	drawBoard(canvas, 30, 16, side);
	colorTile(canvas, 15, 7, "#3366CC", side);
	displayGambit(15, 7, canvas, side);
	canvas.font = "50px Georgia";

	var FPS = 30;
	setInterval(function() {
  		update();
  		draw();
	}, 1000/FPS);

	//changePhase();
	
	//setInterval(colorTileRepeat(canvas, row, col, "#FF0000", "#3366CC", fl, side), 1000);
	//setInterval(canvas.fillText("Score:" + score, side*24, 300), 500);
	//setInterval(changePhase(), 200);

	$(document).keydown(function(key) {
		score++;
		switch (parseInt(key.which,10)) {
			case 37: //left
				--row;
				break;
			case 38: //up
				--col;
				break;
			case 39: //right
				++row;
				break;
			case 40: //down
				++col;
				break;
		}
	});

	function changePhase() {
		requestAnimationFrame(changePhase);
		if (fl == 1) {
			fl = 0;
			colorTile(canvas, 10, 7, "#3366CC", side);
		}
		else {
			fl = 1;
			colorTile(canvas, 10, 7, "#FF0000", side);
		}
	}

	function update() {
		updateScore();
	}

	function draw() {
		drawBoard(canvas, 30, 16, side);
		colorTile(canvas, row, col, "#3366CC", side);
		displayGambit(row, col, canvas, side);
	}

	function updateScore() {
		$("#score").text("Score: " + score);
	}

	function populateGameBoard() {

	}

	function reset() {

	}
});

function drawBoard(context, rows, columns, side) {
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
		 	context.fillRect(i*side, j*side, side, side);		
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

function colorTile(context, row, column, color, side) {
	context.fillStyle = color;
	context.fillRect(row*side, column*side, side, side);
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

function getRandomNumber() {
	return Math.random();
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