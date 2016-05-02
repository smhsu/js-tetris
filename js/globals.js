/***
 * globals.js
 * Silas Hsu
 *
 * Defines important configurations for the tetris game.
 ***/

globals = {
	CANVAS_WIDTH: 400, // Essentially, the resolution of the canvas
	CANVAS_HEIGHT: 800,
	NUM_ROWS: 20,
	NUM_COLS: 10,

	/*
	The resolution of the next block canvas will be dynamically derived from the main canvas so it has the same
	pixels-per-cell.
	*/
	nextBlockPanel: {
		NUM_ROWS: 2,
		NUM_COLS: 4,
		DRAW_ROW: 0,
		DRAW_COL: 1,
	},
	NEXT_BLOCK_CANVAS_SELECTOR: 'canvas', // Selectors apply inside of the info panel only.
	SCORE_DOM_SELECTOR: '.score',
	LEVEL_DOM_SELECTOR: '.level',

	BASE_SCORE_PER_LINE_CLEAR: 100,
	ROW_CLEARS_TO_ADVANCE_LEVEL: 6,
	SPEED_INCREASE_FACTOR: 0.9, // Lower values = more speed for falling blocks per level
	SCORE_INCREASE_FACTOR: 1.1,

	BLOCK_SPAWN_ROW: 0,
	BLOCK_SPAWN_COL: 4,
	BASE_MS_PER_ROW: 800,
	CLEAR_ROW_ANIMATION_LEN: 150,

	MOVE_LEFT_KEY: 'a',
	MOVE_RIGHT_KEY: 'd',
	MOVE_DOWN_KEY: 's',
	ROTATE_CLOCKWISE_KEY: 'l',
	ROTATE_COUNTERCLOCKWISE_KEY: 'j',

	BLOCK_NUMBERS: [ // The index is the number
		'i',
		'j',
		'l',
		'o',
		's',
		't',
		'z'
	],
	BLOCK_COLORS: {
		'i': 'red',
		'j': 'magenta',
		'l': 'yellow',
		'o': 'cyan',
		's': 'blue',
		't': 'grey',
		'z': 'lime'
	},

	GRIDLINE_COLOR: 'grey',
	BLOCK_BORDER_COLOR: 'black',
	CLEARED_BLOCK_COLOR: 'black'
}
