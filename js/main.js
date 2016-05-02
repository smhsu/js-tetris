/***
 * Main.js
 * Creates a tetris object to run, and binds keys as well.
 ***/

window.onload = init;

function init() {
	var canvas = document.getElementById('main-canvas');
	canvas.width = globals.CANVAS_WIDTH;
	canvas.height = globals.CANVAS_HEIGHT;

	var nextBlockCanvas = $('#info-panel canvas');
	var pixelsPerRow = globals.CANVAS_HEIGHT / globals.NUM_ROWS;
	var pixelsPerCol = globals.CANVAS_WIDTH / globals.NUM_COL;
	nextBlockCanvas.width = Math.round(pixelsPerCol * globals.nextBlockPanel.NUM_COLS);
	nextBlockCanvas.height = Math.round(pixelsPerRow * globals.nextBlockPanel.NUM_ROWS);

	var tetris = new Tetris(canvas, $('#info-panel'), globals.NUM_ROWS, globals.NUM_COLS);
	bindKeys(tetris);
	tetris.run();
}

function bindKeys(tetris) {
	window.onkeypress = function(e) {
		var key = String.fromCharCode(e.keyCode);
		switch(key) {
			case globals.MOVE_LEFT_KEY:
				tetris.tryTranslateLeft();
				break;
			case globals.MOVE_RIGHT_KEY:
				tetris.tryTranslateRight();
				break;
			case globals.MOVE_DOWN_KEY:
				tetris.translateDownAndHandleCollisions();
				break;
			case globals.ROTATE_CLOCKWISE_KEY:
				tetris.tryRotateClockwise();
				break;
			case globals.ROTATE_COUNTERCLOCKWISE_KEY:
				tetris.tryRotateCounterclockwise();
				break;
			default:
				;
		}
	}
}
