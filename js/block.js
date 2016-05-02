/***
 * Block.js
 * Silas Hsu
 *
 * The Block class defines a block to be placed inside a Tetris object, and methods for translation and rotation.
 *
 * As anyone that has played Tetris knows, there are several different arrangements of blocks ('l', 'o', etc.).  The
 * constructor accepts the type as a string, or the static method createRandomBlock() can select a random block type.
 ***/

/**
 * Creates a new block.
 * Parameters:
 *   type - a string (e.g. 'i', 'o') that describes the arrangement of blocks.  If it is none of the standard types,
 *       then creates a 1x1 block.
 *   row - row for the center of rotation
 *   col - column for the center of rotation
 *   color - the color to use when drawing the block.
 */
var Block = function(type, row, col, color) {
	this.type = type;
	this.color = color;
	this.yOffset = 0;

	this.occupiedSpaces = [new Coordinate(row, col)]; // occupiedSpaces[0] will always be the center of rotation.
	// Legend: c is the center; x are other blocks
	if (type == 'i') {
		// x c x x
		this.occupiedSpaces[1] = new Coordinate(row, col - 1);
		this.occupiedSpaces[2] = new Coordinate(row, col + 1);
		this.occupiedSpaces[3] = new Coordinate(row, col + 2);
	} else if (type == 'j') {
		// x c x
		//     x
		this.occupiedSpaces[1] = new Coordinate(row, col - 1);
		this.occupiedSpaces[2] = new Coordinate(row, col + 1);
		this.occupiedSpaces[3] = new Coordinate(row + 1, col + 1);
	} else if (type == 'l') {
		// x c x
		// x
		this.occupiedSpaces[1] = new Coordinate(row, col - 1);
		this.occupiedSpaces[2] = new Coordinate(row, col + 1);
		this.occupiedSpaces[3] = new Coordinate(row + 1, col - 1);
	} else if (type == 'o') {
		// c x
		// x x
		this.occupiedSpaces[1] = new Coordinate(row, col + 1);
		this.occupiedSpaces[2] = new Coordinate(row + 1, col);
		this.occupiedSpaces[3] = new Coordinate(row + 1, col + 1);
	} else if (type == 's') {
		//   c x
		// x x
		this.occupiedSpaces[1] = new Coordinate(row, col + 1);
		this.occupiedSpaces[2] = new Coordinate(row + 1, col - 1);
		this.occupiedSpaces[3] = new Coordinate(row + 1, col);
	} else if (type == 't') {
		// x c x
		//   x
		this.occupiedSpaces[1] = new Coordinate(row, col - 1);
		this.occupiedSpaces[2] = new Coordinate(row, col + 1);
		this.occupiedSpaces[3] = new Coordinate(row + 1, col);
	} else if (type == 'z') {
		// x c
		//   x x
		this.occupiedSpaces[1] = new Coordinate(row, col - 1);
		this.occupiedSpaces[2] = new Coordinate(row + 1, col);
		this.occupiedSpaces[3] = new Coordinate(row + 1, col + 1);
	}
}

//                      0    1    2    3    4    5    6
Block.BLOCK_NUMBERS = ['i', 'j', 'l', 'o', 's', 't', 'z'];
Block.BLOCK_COLORS = {
	'i': 'red',
	'j': 'magenta',
	'l': 'yellow',
	'o': 'cyan',
	's': 'blue',
	't': 'grey',
	'z': 'lime'
};

/**
 * Creates a block of random type.  All blocks of the same type will have the same color.
 * Parameters:
 *   row - row for the center of rotation
 *   col - column for the center of rotation
 */
Block.createRandomBlock = function(row, col) {
	var num = Math.floor(Math.random() * Block.BLOCK_NUMBERS.length);
	var type = Block.BLOCK_NUMBERS[num];
	var color = Block.BLOCK_COLORS[type];
	return new Block(type, row, col, color);
}

/**
 * Stores a Y pixel offset to be used during drawing.
 */
Block.prototype.setYOffset = function(offset) {
	this.yOffset = offset;
}

/**
 * Moves this block down one row
 */
Block.prototype.translateDown = function() {
	this.occupiedSpaces.forEach( function(coordinate) {
		coordinate.row += 1;
	});
}

/**
 * Moves this block up one row
 */
Block.prototype.translateUp = function() {
	this.occupiedSpaces.forEach( function(coordinate) {
		coordinate.row -= 1;
	});
}

/**
 * Moves this block left one column
 */
Block.prototype.translateLeft = function() {
	this.occupiedSpaces.forEach( function(coordinate) {
		coordinate.col -= 1;
	});
}

/**
 * Moves this block right one column
 */
Block.prototype.translateRight = function() {
	this.occupiedSpaces.forEach( function(coordinate) {
		coordinate.col += 1;
	});
}

/**
 * Rotates this block clockwise around its center
 */
Block.prototype.rotateClockwise = function() {
	if (this.type == 'o') { // Because o-blocks rotate weirdly, and they don't really need to rotate anyway.
		return;
	}
	var center = this.occupiedSpaces[0];
	for (i = 1; i < this.occupiedSpaces.length; i++) {
		this.occupiedSpaces[i] = this.occupiedSpaces[i].rotated90DegreesAround(center, 'clockwise');
	}
}

/**
 * Rotates this block counterclockwise around its center
 */
Block.prototype.rotateCounterclockwise = function () {
	if (this.type == 'o') { // Because o-blocks rotate weirdly, and they don't really need to rotate anyway.
		return;
	}
	var center = this.occupiedSpaces[0];
	for (i = 1; i < this.occupiedSpaces.length; i++) {
		this.occupiedSpaces[i] = this.occupiedSpaces[i].rotated90DegreesAround(center, 'counterclockwise');
	}
}
