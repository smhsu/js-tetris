window.onload = init;

function init() {
	var canvas = document.getElementById('canvas');
	canvas.width = globals.CANVAS_WIDTH;
	canvas.height = globals.CANVAS_HEIGHT;

	var tetris = new Tetris(canvas, globals.ROWS, globals.COLS);
	tetris.currentBlock = new Block('i', 0, 5, 'red');
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
