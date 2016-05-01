/***
 * tetris.js
 * Silas Hsu
 *
 * Main game code for Tetris, featuring methods for drawing and animation, block translation, collision detection, and
 * line clearing.
 ***/

/**
 * Creates a new Tetris object.
 * Parameters:
 *   canvas - HTML5 canvas on which to draw the game
 *   numRows - number of rows in the grid
 *   numCols - number of cols in the grid
 */
var Tetris = function(canvas, numRows, numCols) {
	// Constant parameters
	this.canvas = canvas;
	this.canvasContext = canvas.getContext('2d');
	this.numRows = numRows;
	this.numCols = numCols;
	this.cellWidth = canvas.width / numCols;
	this.cellHeight = canvas.height / numRows;

	// Game data and dynamic variables
	this.staticBlocks = [];
	for (i = 0; i < numRows; i++) { // Initialize a 2d array
		this.staticBlocks[i] = [];
	}
	this.msToFallOneRow = globals.INITIAL_MS_PER_ROW;
	this.msInCurrentRow = 0;
	this.prevFrameTimestamp = null;
};

/**
 * Main animation loop
 */
Tetris.prototype.run = function() {
	this.msInCurrentRow += this.getMsSinceLastFrame();
	if (this.msInCurrentRow > this.msToFallOneRow) { // The top edge of the current block has passed a row boundary.
		this.translateDownAndHandleCollisions();
		this.msInCurrentRow = this.msInCurrentRow % this.msToFallOneRow;
	}

	var percentThroughRow = this.msInCurrentRow/this.msToFallOneRow;
	this.currentBlock.setYOffset(Math.round(this.cellHeight * percentThroughRow));

	// Calculations done, time to draw a bunch of stuff!
	this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	this.drawGridLines();
	this.drawBlock(this.currentBlock);
	this.drawStaticBlocks();

	window.requestAnimationFrame(this.run.bind(this));
};

/**
 * Returns the amount of time in milliseconds since this function was last called.  Modifies this.prevFrameTimestamp.
 */
Tetris.prototype.getMsSinceLastFrame = function() {
	var timeSinceLastFrame = 0;
	var timestamp = performance.now();
	if (this.prevFrameTimestamp !== null) {
		timeSinceLastFrame = timestamp - this.prevFrameTimestamp;
	}
	this.prevFrameTimestamp = timestamp;
	return timeSinceLastFrame;
}

/**
 * Returns a boolean describing if the specified block is in bounds and has no overlaps with static BLOCK_SPAWN_ROW.
 * Because blocks fall downward and can occupy the space below partially, the bottommost row and coordinates directly
 * above occupied locations are considered invalid as well.
 */
Tetris.prototype.hasValidLocation = function(block) {
	for (i in block.occupiedSpaces) {
		var row = block.occupiedSpaces[i].row;
		var col = block.occupiedSpaces[i].col;
		if (row < 0 ||
			row >= this.numRows - 1 || // Take note: last row considered invalid
			col < 0 ||
			col >= this.numCols ||
			this.staticBlocks[row][col] ||
			this.staticBlocks[row + 1][col]) // Take note: locations above a static block considered invalid
		{
				return false;
		}
	}
	return true;
}

/**
 * Translates the current block left, if there is nothing to collide with.  Otherwise does nothing.
 */
Tetris.prototype.tryTranslateLeft = function() {
	this.currentBlock.translateLeft();
	if (!this.hasValidLocation(this.currentBlock)) {
		this.currentBlock.translateRight();
	}
}

/**
 * Translates the current block right, if there is nothing to collide with.  Otherwise does nothing.
 */
Tetris.prototype.tryTranslateRight = function() {
	this.currentBlock.translateRight();
	if (!this.hasValidLocation(this.currentBlock)) {
		this.currentBlock.translateLeft();
	}
}

/**
 * Translates the current block down, and if further animation will cause this block to collide with the bottom of the
 * grid or a static block, freezes the current block and makes a new block to fall from the top of the grid.
 */
Tetris.prototype.translateDownAndHandleCollisions = function() {
	var currentBlock = this.currentBlock;
	currentBlock.translateDown();
	if (!this.hasValidLocation(this.currentBlock)) {
		for (i in currentBlock.occupiedSpaces) {
			var coordinate = currentBlock.occupiedSpaces[i];
			var row = coordinate.row;
			var col = coordinate.col;
			this.staticBlocks[row][col] = new Block('static', row, col, currentBlock.color);
		}
		this.currentBlock = Block.createRandomBlock(globals.BLOCK_SPAWN_ROW, globals.BLOCK_SPAWN_COL);
	}
}

/**
 * Rotates the current block clockwise, if there is nothing to collide with.  Otherwise does nothing.
 */
Tetris.prototype.tryRotateClockwise = function() {
	this.currentBlock.rotateClockwise();
	if (!this.hasValidLocation(this.currentBlock)) {
		this.currentBlock.rotateCounterclockwise();
	}
}

/**
 * Rotates the current block counterclockwise, if there is nothing to collide with.  Otherwise does nothing.
 */
Tetris.prototype.tryRotateCounterclockwise = function() {
	this.currentBlock.rotateCounterclockwise();
	if (!this.hasValidLocation(this.currentBlock)) {
		this.currentBlock.rotateClockwise();
	}
}

/**
 * Draws grid lines on the canvas that was provided when this Tetris' was created.
 */
Tetris.prototype.drawGridLines = function() {
	var ctx = this.canvasContext;
	ctx.strokeStyle = globals.GRIDLINE_COLOR;
	ctx.beginPath();

	// Draw the vertical grid lines
	var currX = this.cellWidth;
	for (i = 0; i < this.numCols - 1; i++) {
		ctx.moveTo(currX, 0);
		ctx.lineTo(currX, this.canvas.height);
		currX += this.cellWidth;
	}

	// Draw the horizontal grid lines
	var currY = this.cellHeight;
	for (i = 0; i < this.numRows - 1; i++) {
		ctx.moveTo(0, currY);
		ctx.lineTo(this.canvas.width, currY);
		currY += this.cellHeight;
	}

	ctx.stroke();
	ctx.closePath();
};

/**
 * Draws the specified block on the canvas.
 */
Tetris.prototype.drawBlock = function(block) {
	var ctx = this.canvasContext;
	ctx.fillStyle = block.color;
	ctx.strokeStyle = globals.BLOCK_BORDER_COLOR;
	var cellWidth = this.cellWidth;
	var cellHeight = this.cellHeight;

	block.occupiedSpaces.forEach( function(coordinate) {
		var canvasX = coordinate.col * cellWidth;
		var canvasY = coordinate.row * cellHeight;
		ctx.fillRect(canvasX, canvasY + block.yOffset, cellWidth, cellHeight);
		ctx.strokeRect(canvasX, canvasY + block.yOffset, cellWidth, cellHeight);
	});
}

/**
 * Draws all the blocks in this.staticBlocks.
 */
Tetris.prototype.drawStaticBlocks = function() {
	for (i in this.staticBlocks) {
		for (j in this.staticBlocks[i]) {
			if (this.staticBlocks[i][j]) {
				this.drawBlock(this.staticBlocks[i][j])
			}
		}
	}
}
