//Game code
//Start game. Populate meta game board with numbers. Add score as player traverses the board.
//Numbers must be Negative and Positive.
//Get off the board with the number of moves remaining and maximum score.
//At every step show maximum possible score (Will require max_score algorithm)
//Have option to expose board that shows path with maximum score.
//note: move tracking is not perfect because the move tracker array does not account for predictive moves being made.
//color for p2:#6600CC

$(document).ready(function () {

	/*Need to decide color codes for tiles*/
	var game_interval_id = 0;
	var FPS = 30;
	var game_type = 1;
	var meta_gameboard = [];
	var move_tracker = [];
	var opp_move_tracker = [];
	var master_move_tracker = [];
	var win_move_comb = [];
	var gameboard = document.getElementById("gameboard");
	gameboard.width = $(window).width() - $("#info").width();
	gameboard.height = $(window).height();
	var canvas = gameboard.getContext("2d");
	var col_side = Math.floor(($(window).width() - $("#info").width())/31);
	var row_side = Math.floor($(window).height()/17);
	var row_limit = 17;
	var col_limit = 31;
	var row = 8; //Since counts start from 0, limit(median) - 1 
	var col = 7;
	var opp_row = 8; //Since counts start from 0, limit(median) - 1 
	var opp_col = 22;
	var gamestarted = false;
	var score = 0;
	var opp_score = 0;
	var fl = 0;
	var moves = 100;
	var opp_moves = 100;
	var move_flag = true;
	var player_moving = 0;
	canvas.font = "italic 100px Helvetica";
	
	drawWelcomeScreen();

	$("#playbutton").click(function() {
		startGame();
	});

	$("#expbutton").click(function() {
		
	});

	$("#helpbutton").click(function() {
		var overlay = "<div class='dialog' style='overflow-y:scroll;'>";

		overlay += "<br></br>";
		overlay += "<h1 class='gtitle' style='color: #3366CC;font-size:50px;'>GAMBIT: HELP</h1>";
		overlay += "<br></br>";

		overlay += "<h2 style='color: #3366CC;'>How To Play</h2>";
		overlay += "<p style='font-size:20px; margin-left:auto; margin-right:auto; width: 40em;'>Free Play: The objective is simple: Maximize your score. Every tile has a negative or";
		overlay+= "positive score associated with it. Move across the board to score points. At every step you face a gambit Indicated by the colors green (safe),";
		overlay += "orange (risky), and red (major gambit). Move across the board keeping in mind that spots once traversed cannot be traversed again.</p>";
		overlay += "<p style='font-size:20px; margin-left:auto; margin-right:auto; width: 40em;'>VS AI: Beat an AI in a game that follows the same rules as freeplay with a few excpetions; An increase in your score results in a decrease in your opponent's score and vice versa; A destination square is appointed to each player that must be reached by the last move. The player with the highest score at the destination wins; You can be cut off from your destination or from making moves by your opponent.</p>";
		overlay += "<p style='font-size:20px; margin-left:auto; margin-right:auto; width: 40em;'>VS Human: Play a game against a friend. Aforemonetioned rules apply.</p>";

		overlay += "<h2 style='color: #3366CC;'>About</h2>";
		overlay += "<p style='font-size:20px; margin-left:auto; margin-right:auto; width: 40em;'>Concieved and developed by Murtuza Kainan. &copy Murtuza Kainan.</p>";

		overlay += "<p><Button id='close-d'>Close";
		overlay += "</Button></p>";


        overlay += "</div>"; //close overlay div
        var $overl = $(overlay);
        $overl.appendTo("body"); //Appends to body and adds to DOM
        $(".dialog").fadeIn();
	});

	$("#menubutton").click(function() {
		var overlay = "<div class='dialog' style='overflow-y:scroll;'>";

		overlay += "<br></br>";
		overlay += "<h1 class='gtitle' style='color: #3366CC;font-size:50px;'>GAMBIT: MENU</h1>";
		overlay += "<br></br>";

		overlay += "<p><Button id='freeplay'>Free Play";
		overlay += "</Button></p>";
		overlay += "<p><Button id='playvai'>Play VS AI";
		overlay += "</Button></p>";
		overlay += "<p><Button id='playvh'>Play VS Human";
		overlay += "</Button></p>";
		overlay += "<p><Button id='close-d'>Close";
		overlay += "</Button></p>";


        overlay += "</div>"; //close overlay div
        var $overl = $(overlay);
        $overl.appendTo("body"); //Appends to body and adds to DOM
        $(".dialog").fadeIn();
	});

	$(document).on('click', '#close-d', function () {
    	$(".dialog").remove();
    });

    $(document).on('click', '#freeplay', function () {
    	game_type = 1;
    	score = 0;
		moves = 100;
    	$("#gmtype").text("Free Play");
    	$("#score2").css("visibility","hidden");
    	$("#movesleft2").css("visibility","hidden");

    	$("#score").text("Score: " + score);
    	$("#movesleft").text("Moves Left: " + moves);

    	gamestarted = false;
    	drawWelcomeScreen();
    });

    $(document).on('click', '#playvai', function () {
    	game_type = 2;
    	score = 0;
		moves = 100;
    	$("#gmtype").text("VS AI");
    	$("#score2").css("visibility","visible");
    	$("#movesleft2").css("visibility","visible");

    	$("#score").text("P1 Score: " + score);
    	$("#movesleft").text("P1 Moves Left: " + moves);
    	$("#score2").text("AI Score: " + opp_score);
    	$("#movesleft2").text("AI Moves Left: " + opp_moves);

    	gamestarted = false;
    	drawWelcomeScreen();
    });

    $(document).on('click', '#playvh', function () {
    	game_type = 3;
    	score = 0;
		moves = 100;
    	$("#gmtype").text("VS Human");
    	$("#score2").css("visibility","visible");
    	$("#movesleft2").css("visibility","visible");

    	$("#score").text("P1 Score: " + score);
    	$("#movesleft").text("P1 Moves Left: " + moves);
    	$("#score2").text("P2 Score: " + opp_score);
    	$("#movesleft2").text("P2 Moves Left: " + opp_moves);

    	gamestarted = false;
    	drawWelcomeScreen();
    });
	


	function startGame() {
		
		canvas.fillStyle = "#FF0000";
		clearInterval(game_interval_id);

		switch (game_type) {
			case 1:
				gamestarted = true;
				populateGameBoard();
				console.log(meta_gameboard);
				console.log(move_tracker);
				console.log(max_score());
				console.log(win_move_comb);
				score = 0;
				moves = 100;
				row = 8;
				col = 15;
				
				game_interval_id = setInterval(function() {
					//gameboard.width = $(window).width() - $("#info").width();
					//gameboard.height = $(window).height();
					var col_side = Math.floor(($(window).width() - $("#info").width())/31);
					var row_side = Math.floor($(window).height()/17);
					if (gamestarted) {
						update();

  						draw();
  						display_occupied_spots();
  						if (moves <= 0) {
							gamestarted = false;
							drawGO();
						}
					}
				}, 1000/FPS);
				break;
			case 2:
				score = 0;
				opp_score = 0;
				moves = 100;
				opp_moves = 100;
				row = 8;
				opp_row = 8;
				col = 7;
				opp_col = 22;
				break;
			case 3:
				gamestarted = true;
				populateGameBoard();
				console.log(meta_gameboard);
				console.log(move_tracker);
				console.log(max_score());
				console.log(win_move_comb);
				score = 0;
				opp_score = 0;
				moves = 100;
				opp_moves = 100;
				row = 8;
				opp_row = 8;
				col = 7;
				opp_col = 22;
				player_moving = 1;

				game_interval_id = setInterval(function() {
					//gameboard.width = $(window).width() - $("#info").width();
					//gameboard.height = $(window).height();
					var col_side = Math.floor(($(window).width() - $("#info").width())/31);
					var row_side = Math.floor($(window).height()/17);
					if (gamestarted) {
						update();

  						draw();
  						display_occupied_spots();
  						if (moves <= 0) {
							gamestarted = false;
							drawGO();
						}
					}
				}, 1000/FPS);

				break;
		}
	}

	

	//changePhase();
	
	//setInterval(colorTileRepeat(canvas, row, col, "#FF0000", "#3366CC", fl, side), 1000);
	//setInterval(canvas.fillText("Score:" + score, side*24, 300), 500);
	//setInterval(changePhase(), 200);

	$(document).keydown(function(key) {
		if (gamestarted) {
			switch (parseInt(key.which,10)) {
			case 37: //left
				switch (game_type) {
					case 1:
						if (col > 0) {
							if (!master_move_tracker[row][col-1]) {
								score += meta_gameboard[row][--col];
								record_move();
								moves--;
							}
						}
						break;
					case 2:
						break;
					case 3:
						if (player_moving == 1) {
							if (col > 0) {
								if (!master_move_tracker[row][col-1]) {
									score += meta_gameboard[row][--col];
									record_move();
									moves--;
								}
							}
						}
						else {
							if (opp_col > 0) {
								if (!master_move_tracker[opp_row][opp_col-1]) {
									opp_score += meta_gameboard[opp_row][--opp_col];
									record_move();
									opp_moves--;
								}
							}
						}
						changePlayer();
						break;
				}
				
				break;
			case 38: //up
				switch (game_type) {
					case 1:
						if (row > 0) {
							if (!master_move_tracker[row-1][col]) {
								score += meta_gameboard[--row][col];
								record_move();
								moves--;
							}
						}
						break;
					case 2:
						break;
					case 3:
						if (player_moving == 1) {
							if (row > 0) {
								if (!master_move_tracker[row-1][col]) {
									score += meta_gameboard[--row][col];
									record_move();
									moves--;
								}
							}
						}
						else {
							if (opp_row > 0) {
								if (!master_move_tracker[opp_row-1][opp_col]) {
									opp_score += meta_gameboard[--opp_row][opp_col];
									record_move();
									opp_moves--;
								}
							}
						}
						changePlayer();
						break;
				}
				break;
			case 39: //right
				switch (game_type) {
					case 1:
						if (col < col_limit - 1) {
							if (!master_move_tracker[row][col+1]) {
								score += meta_gameboard[row][++col];
								record_move();
								moves--;
							}
						}
						break;
					case 2:
						break;
					case 3:
						if (player_moving == 1) {
							if (col < col_limit - 1) {
								if (!master_move_tracker[row][col+1]) {
									score += meta_gameboard[row][++col];
									record_move();
									moves--;
								}
							}
						}
						else {
							if (opp_col < col_limit - 1) {
								if (!master_move_tracker[opp_row][opp_col+1]) {
									opp_score += meta_gameboard[opp_row][++opp_col];
									record_move();
									opp_moves--;
								}
							}
						}
						changePlayer();
						break;
				}
				break;
			case 40: //down
				switch (game_type) {
					case 1:
						if (row < row_limit- 1) {
							if (!master_move_tracker[row+1][col]) {
								score += meta_gameboard[++row][col];
								record_move();
								moves--;
							}
						}
						break;
					case 2:
						break;
					case 3:
						if (player_moving == 1) {
							if (row < row_limit - 1) {
								if (!master_move_tracker[row+1][col]) {
									score += meta_gameboard[++row][col];
									record_move();
									moves--;
								}
							}
						}
						else {
							if (opp_row < row_limit - 1) {
								if (!master_move_tracker[opp_row+1][opp_col]) {
									opp_score += meta_gameboard[++opp_row][opp_col];
									record_move();
									opp_moves--;
								}
							}
						}
						changePlayer();
						break;
				}
				break;
			}
		}
		console.log(max_score());
		console.log(win_move_comb);
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

		if (game_type == 1) {
			colorTile(canvas, row, col, "#3366CC", row_side, col_side);
			displayGambit(row, col, canvas, row_side, col_side, meta_gameboard);
		}
		else {
			colorTile(canvas, row, col, "#3366CC", row_side, col_side);
			displayGambit(row, col, canvas, row_side, col_side, meta_gameboard);
			colorTile(canvas, opp_row, opp_col, "#6600CC", row_side, col_side);
			displayGambit(opp_row, opp_col, canvas, row_side, col_side, meta_gameboard);
		}
	}

	function drawGO() {
		canvas.fillStyle = "black";
		canvas.fillRect(0, 0, col_side*31, row_side*17);
		canvas.fillStyle = "White";

		canvas.fillText("Game", 15*col_side - 127, 8*row_side - 50);	
		colorTile(canvas, 8, 15, "#3366CC", row_side, col_side);
		canvas.fillStyle = "White";
		canvas.fillText("Over", 15*col_side - 95, 8*row_side + 150);
	}

	function drawWelcomeScreen() {
		canvas.fillStyle = "black";
		canvas.fillRect(0, 0, col_side*31, row_side*17);
		canvas.fillStyle = "White";

		canvas.fillText("Dare il", 15*col_side - 137, 8*row_side - 50);	
		colorTile(canvas, 8, 15, "#3366CC", row_side, col_side);
		canvas.fillStyle = "White";
		canvas.fillText("Gambetto", 15*col_side - 207, 8*row_side + 150);
	}

	function updateScore() {
		switch (game_type) {
		case 1:
			$("#score").text("Score: " + score);
			$("#movesleft").text("Moves Left: " + moves);
			break;
		case 2:
			$("#score").text("P1 Score: " + score);
    		$("#movesleft").text("P1 Moves Left: " + moves);
    		$("#score2").text("AI Score: " + opp_score);
    		$("#movesleft2").text("AI Moves Left: " + opp_moves);
			break;
		case 3:
			$("#score").text("P1 Score: " + score);
    		$("#movesleft").text("P1 Moves Left: " + moves);
    		$("#score2").text("P2 Score: " + opp_score);
    		$("#movesleft2").text("P2 Moves Left: " + opp_moves);
			break;
		}
	}



	function populateGameBoard() {
		for (i = 0; i < row_limit; i++) {
			meta_gameboard[i] = new Array(31);
			move_tracker[i] = new Array(31);
			master_move_tracker[i] = new Array(31);
			if (game_type != 1) opp_move_tracker[i] = new Array(31);
			for (j = 0; j < col_limit; j++) {
				meta_gameboard[i][j] = getRandomNumber(-100, 100);
				move_tracker[i][j] = false;
				master_move_tracker[i][j] = false;
				if (game_type != 1) opp_move_tracker[i][j] = false;
			}
		}
		if (game_type == 1) {
			move_tracker[8][15] = true;
			master_move_tracker[8][15] = true;
		}
		else {
			move_tracker[8][7] = true;
			opp_move_tracker[8][22] = true;
			master_move_tracker[8][7] = true;
			master_move_tracker[8][22] = true;

		}
	}

	function record_move() {
		if (game_type == 1) {
			move_tracker[row][col] = true;
			master_move_tracker[row][col] = true;
		}
		else {
			move_tracker[row][col] = true;
			opp_move_tracker[opp_row][opp_col] = true;
			master_move_tracker[row][col] = true;
			master_move_tracker[opp_row][opp_col] = true;
		}
	}

	function display_occupied_spots() {
		for (i = 0; i < row_limit; i++) {
			for (j = 0; j < col_limit; j++) {
				if (move_tracker[i][j] == true) {
					colorTile(canvas, i, j, "#3366CC", row_side, col_side);
				}
				if (game_type != 1) {
					if (opp_move_tracker[i][j] == true) {
						colorTile(canvas, i, j, "#6600CC", row_side, col_side);
					}
				}	
			}
		}
	}

	function max_score() {
		win_move_comb = new Array();
		if (!gamestarted || moves <= 0) {
			win_move_comb.push("GAME_TERMINATED");
			return 0;
		}

		var s1 = 0;
		var s2 = 0;
		var s3 = 0;
		var s4 = 0;	

		if (row > 0) {
			if (!move_tracker[row-1][col])
				s1 += rec_max_score(10, row-1, col);
		}
		if (row < 16) {
			if (!move_tracker[row+1][col])
				s2 += rec_max_score(10, row+1, col);
		}
		if (col > 0) {
			if (!move_tracker[row][col-1])
				s3 += rec_max_score(10, row, col-1);
		}
		if (col < 30) {
			if (!move_tracker[row][col+1])
				s4 += rec_max_score(10, row, col+1);
		}


		if (row > 0) {
			if (s1 >= s2 && s1 >= s3 && s1 >= s4 && !move_tracker[row-1][col]) {
				win_move_comb.push("UP");
				return s1 + score;
			}
		}
		if (row < 16) { 
			if (s2 >= s1 && s2 >= s3 && s2 >= s4 && !move_tracker[row+1][col]) {
				win_move_comb.push("DOWN");
				return s2 + score;
			}
		}
		if (col > 0) {
			if (s3 >= s1 && s3 >= s2 && s3 >= s4 && !move_tracker[row][col-1]) {
				win_move_comb.push("LEFT");
				return s3 + score;
			}
		}
		if (col < 30) {
			if (s4 >= s1 && s4 >= s2 && s4 >= s3 && !move_tracker[row][col+1]) {
				win_move_comb.push("RIGHT");
				return s4 + score;
			}
		}

		return 0;
	}

	function rec_max_score(mv, r, c) {

		if (mv <= 0) {
			return 0;
		}
		else {
			var s1 = 0;
			var s2 = 0;
			var s3 = 0;
			var s4 = 0;

			//console.log(mv);


			if (r > 0) {
				if (!move_tracker[r-1][c])
					s1 += rec_max_score(mv - 1, r-1, c) + meta_gameboard[r][c];
			}
			if (r < 16) {
				if (!move_tracker[r+1][c])
					s2 += rec_max_score(mv - 1, r+1, c) + meta_gameboard[r][c];
			}
			if (c > 0) {
				if (!move_tracker[r][c-1])
					s3 += rec_max_score(mv - 1, r, c-1) + meta_gameboard[r][c];
			}
			if (c < 30) {
				if (!move_tracker[r][c+1])
					s4 += rec_max_score(mv - 1, r, c+1) + meta_gameboard[r][c];
			}

			if (r >= 0) {
				if (s1 >= s2 && s1 >= s3 && s1 >= s4 && !move_tracker[r][c]) {
					return s1;
				}
			}
			if (r <= 16) {
				if (s2 >= s1 && s2 >= s3 && s2 >= s4 && !move_tracker[r][c]) {
					return s2;
				}
			}
			if (c >= 0) {
				if (s3 >= s1 && s3 >= s2 && s3 >= s4 && !move_tracker[r][c]) {
					return s3;
				}
			}
			if (c <= 30) {
				if (s4 >= s1 && s4 >= s2 && s4 >= s3 && !move_tracker[r][c]) {
					return s4;
				}
			}

			return 0;
		}

	}

	function makeMove() {

	}

	function changePlayer() {
		if (player_moving == 1) {
			player_moving = 2;
		}
		else {
			player_moving = 1;
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
