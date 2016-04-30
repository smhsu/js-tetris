/***
 * tetris.js
 * Silas Hsu
 ***/

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
	this.currentBlock.draw();
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
 * Translates the current block left, if there is nothing to collide with.  Otherwise does nothing.
 */
Tetris.prototype.tryTranslateLeft = function() {
	if (!this.currentBlock.hasCollisionLeft()) {
		this.currentBlock.translateLeft();
	}
}

/**
 * Translates the current block right, if there is nothing to collide with.  Otherwise does nothing.
 */
Tetris.prototype.tryTranslateRight = function() {
	if (!this.currentBlock.hasCollisionRight()) {
		this.currentBlock.translateRight();
	}
}

/**
 * Translates the current block down, and if further animation will cause this block to collide with the bottom of the
 * grid or a static block, freezes the current block and makes a new block to fall from the top of the grid.
 */
Tetris.prototype.translateDownAndHandleCollisions = function() {
	var block = this.currentBlock;
	block.translateDown(); // The row below is always unoccupied, since we checked in a previous call to this method.
	if (block.hasCollisionBelow()) {

		for (i in block.occupiedSpaces) {
			var coordinate = block.occupiedSpaces[i];
			var row = coordinate.row;
			var col = coordinate.col;
			this.staticBlocks[row][col] = new Block(this, 'static', new Coordinate(row, col), block.color);
		}
		this.currentBlock = Block.createRandomBlock(this, new Coordinate(globals.BLOCK_SPAWN_ROW, globals.BLOCK_SPAWN_COL));
	}
}

/**
 * Draws grid lines on the canvas that was provided when this Tetris' was created.
 */
Tetris.prototype.drawGridLines = function() {
	var ctx = this.canvasContext;
	ctx.strokeStyle = 'grey';
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
 * Draws all the blocks in this.staticBlocks.
 */
Tetris.prototype.drawStaticBlocks = function() {
	this.staticBlocks.forEach( function(row) {
		row.forEach( function(block) {
			block.draw();
		});
	});
}
