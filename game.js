
/*
	Remember how the indexing here works, [rows][columns], so a for loop goes horizontally 
	through each row, just like the rastering of a TV screen.
 */
$(document).ready(function() {

	// Global variables.
	var isFirstMove = false;
	var sideDimension = 4;
	var selectedOrigin;
	var gameState = new Array(sideDimension);
	var firstPlayer = null;
	
	for (var i = 0; i < sideDimension; i++) {
		gameState[i] = new Array(sideDimension);
	}

	/* Create the given SVG element in the namespace we're using. */
	document.createSvg = function(tagName) {
		var svgNS = "http://www.w3.org/2000/svg";		// This can be any string.
		return this.createElementNS(svgNS, tagName);
	};

	/* Add event listeners to player start buttons. */

	/* Reset the game state by clearing the recorded played positions. */
	function resetGameState() {
		for (var i = 0; i < sideDimension; i++) {
			for (var j = 0; j < sideDimension; j++) {
				gameState[i][j] = false;
			}
		}
	}

	/* If the given cell is orthogonally adjacent to the selected origin cell, 
	   return true, otherwise return false. */
	function isOrthogonallyAdjacent(cell) {
		if (selectedOrigin == null) {
			return false;
		}

		var origin = parseInt(selectedOrigin.slice(3));
		var destination = parseInt(cell.slice(3));

		return ((origin != destination) &&
			     ((destination - sideDimension == origin) ||
			      (destination + sideDimension == origin) ||
			      (destination == origin + 1) || 
			      (destination == origin - 1)));
	}

	/* Record a move in the game state memory. */
	function recordMove(cell) {
		var originIndex = parseInt(selectedOrigin.slice(3));
		var destinationIndex = parseInt(cell.slice(3));

		var originRow = Math.floor(originIndex / sideDimension);
		var originColumn = originIndex % sideDimension; 
		gameState[originRow][originColumn] = true;
		
		var destinationRow = Math.floor(destinationIndex / sideDimension);
		var destinationColumn = destinationIndex % sideDimension; 
		gameState[destinationRow][destinationColumn] = true;
	}

	/* Returns true if given cell is occupied, false otherwise. */
	function isCellOccupied(cell) {
		var index = parseInt(cell.slice(3));
		var cellRow = Math.floor(index / sideDimension);
		var cellColumn = index % sideDimension;
		return gameState[cellRow][cellColumn];
	} 

	/* Print the current game state to the console (for debugging). */
	function printGameState() {
		for (var i = 0; i < sideDimension; i++) {
			var col = i + " |";
			for (var j = 0; j < sideDimension; j++) {
				if (gameState[i][j]) {
					col = col.concat("*|");
				} else {
					col = col.concat(" |"); 
				}
			}
			console.log(col);
		}
	}
	
	/* Draw the game grid on the screen and add cell click listeners. */
	var grid = function(numberPerSide, size, pixelsPerSide, colors) {
		var svg = document.createSvg("svg");

		svg.setAttribute("width", pixelsPerSide);
		svg.setAttribute("height", pixelsPerSide);
		svg.setAttribute("viewBox", [0, 0, numberPerSide * size, numberPerSide * size].join(" "));
		svg.setAttribute("stroke", "black");
		svg.setAttribute("stroke-width", "5px");
		
		for (var i = 0; i < numberPerSide; i++) {
			for (var j = 0; j < numberPerSide; j++) {
				var number = numberPerSide * j + i;
				var color = colors[(i + j) % colors.length];
				var box = document.createSvg("rect");
				box.setAttribute("transform", ["translate(", i * size, ",", j * size, ")"].join(""));
				box.setAttribute("width", size);
				box.setAttribute("height", size);
				box.setAttribute("fill", color);
				box.setAttribute("id", "box" + number);
				svg.appendChild(box);
			}
		}

		svg.addEventListener("mousedown", function(e) {
			var cell = e.target.id;
			console.log("Down: " + cell);
			if (isCellOccupied(cell)) {
				selectedOrigin = null;
			} else {
				selectedOrigin = cell;
			}	
		});			
		
		svg.addEventListener("mouseup", function(e) {
			var cell = e.target.id;
			console.log("Up: " + cell);
	
			if (!isCellOccupied(cell) && isOrthogonallyAdjacent(cell)) {
				$('#' + cell).attr("fill", "FireBrick");	
				$('#' + selectedOrigin).attr("fill", "FireBrick");	
				recordMove(cell);
			}
			printGameState();
		});	

		return svg;
	};

	// Program entry point.
	resetGameState();
	$('#container').append(grid(sideDimension, 300, 320, ["SeaShell", "WhiteSmoke"]));
});
