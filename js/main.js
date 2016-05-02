/***
 * Main.js
 * Defines important Tetris configurations.  Creates a tetris object to run, and binds keys as well.
 ***/

window.onload = init;

// Constants
var Main = {
	MAIN_CANVAS_WIDTH: 400, // Essentially, the resolution of the canvas
	MAIN_CANVAS_HEIGHT: 800,
	NUM_ROWS: 20,
	NUM_COLS: 10,

	MAIN_CANVAS_DOM_SELECTOR: '#main-canvas',
	INFO_PANEL_DOM_SELECTOR: '#main-info-panel',
	CONTROLS_DOM_SELECTOR: '#controls',

	MOVE_LEFT_KEY: 'a',
	MOVE_RIGHT_KEY: 'd',
	MOVE_DOWN_KEY: 's',
	ROTATE_CLOCKWISE_KEY: 'l',
	ROTATE_COUNTERCLOCKWISE_KEY: 'j'
}

/**
 * Sets the resolution of canvases, and creates and runs the Tetris game.
 */
function init() {
	var canvas = $(Main.MAIN_CANVAS_DOM_SELECTOR)[0];
	canvas.width = Main.MAIN_CANVAS_WIDTH;
	canvas.height = Main.MAIN_CANVAS_HEIGHT;

	// Derive the resolution of the next block canvas from the main canvas so it has the same pixels-per-cell.
	var infoPanel = $(Main.INFO_PANEL_DOM_SELECTOR);
	var nextBlockCanvas = infoPanel.find(Tetris.INFO_CANVAS_DOM_SELECTOR)
	var pixelsPerRow = Main.MAIN_CANVAS_HEIGHT / Main.NUM_ROWS;
	var pixelsPerCol = Main.MAIN_CANVAS_WIDTH / Main.NUM_COL;
	nextBlockCanvas.width = Math.round(pixelsPerCol * Tetris.nextBlockInfo.NUM_COLS);
	nextBlockCanvas.height = Math.round(pixelsPerRow * Tetris.nextBlockInfo.NUM_ROWS);

	// Canvas math done!  Let's create the game and run it!
	var tetris = new Tetris(canvas, infoPanel, Main.NUM_ROWS, Main.NUM_COLS);
	printControls($(Main.CONTROLS_DOM_SELECTOR));
	bindKeys(tetris);
	tetris.run();
}

/**
 * Sets the input Tetris object to respond to keypresses from the window.
 */
function bindKeys(tetris) {
	window.onkeypress = function(e) {
		var key = String.fromCharCode(e.keyCode);
		switch(key) {
			case Main.MOVE_LEFT_KEY:
				tetris.tryTranslateLeft();
				break;
			case Main.MOVE_RIGHT_KEY:
				tetris.tryTranslateRight();
				break;
			case Main.MOVE_DOWN_KEY:
				tetris.translateDownAndHandleCollisions();
				break;
			case Main.ROTATE_CLOCKWISE_KEY:
				tetris.tryRotateClockwise();
				break;
			case Main.ROTATE_COUNTERCLOCKWISE_KEY:
				tetris.tryRotateCounterclockwise();
				break;
			default:
				;
		}
	}
}

/**
 * Appends an <ul></ul> of controls to the input jQuery element
 */
function printControls(domElement) {
	var list = $('<ul></ul>');
	list.append($('<li>← : ' + Main.MOVE_LEFT_KEY + '</ul>'));
	list.append($('<li>↓ : ' + Main.MOVE_DOWN_KEY + '</ul>'));
	list.append($('<li>→ : ' + Main.MOVE_RIGHT_KEY + '</ul>'));
	list.append($('<li>↺ : ' + Main.ROTATE_COUNTERCLOCKWISE_KEY + '</ul>'));
	list.append($('<li>↻ : ' + Main.ROTATE_CLOCKWISE_KEY + '</ul>'));
	domElement.append(list);
}
