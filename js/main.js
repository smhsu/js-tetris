window.onload = init;

function init() {
	var canvas = document.getElementById('canvas');
	canvas.width = globals.CANVAS_WIDTH;
	canvas.height = globals.CANVAS_HEIGHT;

	var tetris = new Tetris(canvas, globals.ROWS, globals.COLS);
	tetris.currentBlock = new Block(tetris, 's', new Coordinate(0, 5), 'red');
	bindKeys(tetris);
	tetris.run();
}

function bindKeys(tetris) {
	window.onkeypress = function(e) {
		switch(e.keyCode) {
			case globals.MOVE_LEFT_KEY:
				tetris.tryTranslateLeft();
				break;
			case globals.MOVE_RIGHT_KEY:
				tetris.tryTranslateRight();
				break;
			case globals.MOVE_DOWN_KEY:
				tetris.translateDownAndHandleCollisions();
				break;
			default:
				;
		}
	}
}
