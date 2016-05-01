/***
 * globals.js
 * Silas Hsu
 *
 * Defines important configurations for the tetris game.
 ***/

globals = {
	CANVAS_WIDTH: 400,
	CANVAS_HEIGHT: 800,
	NUM_ROWS: 20,
	NUM_COLS: 10,

	ROW_CLEARS_TO_ADVANCE_LEVEL: 6,
	LEVEL_SPEED_INCREASE: 0.1, // Percentage increase

	BLOCK_SPAWN_ROW: 0,
	BLOCK_SPAWN_COL: 4,
	INITIAL_MS_PER_ROW: 800,
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
