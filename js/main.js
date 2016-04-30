window.onload = init;

function init() {
	var canvas = document.getElementById('canvas');
	canvas.width = globals.CANVAS_WIDTH;
	canvas.height = globals.CANVAS_HEIGHT;

	var tetris = new Tetris(canvas, globals.ROWS, globals.COLS);
	tetris.currentBlock = new Block(tetris, "asdf", new Coordinate(0, 1), 'red');
	bindKeys(tetris);
	tetris.draw();
}

function bindKeys(tetris) {
	window.onkeypress = function(e) {
		switch(e.keyCode) {
			case globals.MOVE_LEFT_KEY:
				tetris.currentBlock.translateLeft();
				break;
			case globals.MOVE_RIGHT_KEY:
				tetris.currentBlock.translateRight();
				break;
			case globals.MOVE_DOWN_KEY:
				tetris.currentBlock.translateDown();
				break;
			default:
				;
		}
	}
}
