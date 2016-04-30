/***
 * Block.js
 * Silas Hsu
 *
 * The Block class defines a block to be placed inside a Tetris object, a way to draw it, methods for translation
 * and rotation, and detecting if these operations will cause a collision.  To do this, block objects need a Tetris
 * object and a center of rotation upon creation.
 *
 * As anyone that has played Tetris knows, there are several different arrangements of blocks ('l', 'o', etc.).  The
 * constructor accepts the type as a string, or the static method createRandomBlock() can select a random block type.
 ***/

/**
 * Creates a new block.
 * Parameters:
 *   tetris - a Tetris object to be used for drawing and collision detection
 *   type - a string (e.g. 'i', 'o') that describes the arrangement of blocks.  If it is none of the standard types,
 *       then creates a 1x1 block.
 *   center - a Coordinate object describing the center of rotation
 *   color - the color to use when drawing the block.
 */
var Block = function(tetris, type, center, color) {
	this.tetris = tetris;
	this.type = type;
	this.center = center;
	this.color = color;
	this.yOffset = 0;

	this.occupiedSpaces = [center]; // occupiedSpaces[0] will always be the center of rotation.
	var row = center.row;
	var col = center.col;
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
};

/**
 * Creates a block of random type.  All blocks of the same type will have the same color.
 * Parameters:
 *   tetris - a Tetris object to be used for drawing and collision detection
 *   center - a Coordinate object describing the center of rotation
 */
Block.createRandomBlock = function(tetris, center) {
	var num = Math.floor(Math.random() * globals.BLOCK_NUMBERS.length);
	var type = globals.BLOCK_NUMBERS[num];
	var color = globals.BLOCK_COLORS[type];
	return new Block(tetris, type, center, color);
}

/**
 * Draw this block (with possible vertical offset) on the Tetris object that was provided when the block was created.
 */
Block.prototype.draw = function() {
	var canvasContext = this.tetris.canvasContext;
	canvasContext.fillStyle = this.color;
	var cellWidth = this.tetris.cellWidth;
	var cellHeight = this.tetris.cellHeight;

	for (i in this.occupiedSpaces) {
		var canvasX = this.occupiedSpaces[i].col * cellWidth;
		var canvasY = this.occupiedSpaces[i].row * cellHeight;
		canvasContext.fillRect(canvasX, canvasY + this.yOffset, cellWidth, cellHeight);
	}
}

/**
 * Translates this block a number of pixels up or down when this block's draw() method is called.  Positive numbers
 * translate the block down, and negative ones translate it up.
 */
Block.prototype.setYOffset = function(offset) {
	this.yOffset = offset;
}

/**
 * Returns a boolean describing if the space(s) below this block are occupied by a static block or is out of bounds,
 * according to the Tetris object that was given when this block was created.  Note that the block may be drawn into the
 * occupied space if there is a positive Y offset.
 */
Block.prototype.hasCollisionBelow = function() {
	var tetris = this.tetris;
	for (i in this.occupiedSpaces) {
		var coordinate = this.occupiedSpaces[i];
		var row = coordinate.row;
		var col = coordinate.col;
		if (row + 1 >= tetris.numRows || tetris.staticBlocks[row + 1][col]) {
			return true;
		}
	}
	return false;
}

/**
 * Returns a boolean describing if the space(s) to the left of this block are occupied by a static block or is out of
 * bounds, according to the Tetris object that was given when this block was created.
 */
Block.prototype.hasCollisionLeft = function() {
	var tetris = this.tetris;
	for (i in this.occupiedSpaces) {
		var coordinate = this.occupiedSpaces[i];
		var row = coordinate.row;
		var col = coordinate.col;
		if (col == 0 || tetris.staticBlocks[row][col - 1] || tetris.staticBlocks[row + 1][col - 1]) {
			return true;
		}
	}
	return false;
}

/**
 * Returns a boolean describing if the space(s) to the right of this block are occupied by a static block or is out of
 * bounds, according to the Tetris object that was given when this block was created.
 */
Block.prototype.hasCollisionRight = function() {
	var tetris = this.tetris;
	for (i in this.occupiedSpaces) {
		var coordinate = this.occupiedSpaces[i];
		var row = coordinate.row;
		var col = coordinate.col;
		if (col >= tetris.numCols - 1 || tetris.staticBlocks[row][col + 1] || tetris.staticBlocks[row + 1][col + 1]) {
			return true;
		}
	}
	return false;
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
