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
 *   canvas - main HTML5 canvas on which to draw the game
 *   infoPanel - a jQuery DOM element that contains the info panel
 *   numRows - number of rows in the grid
 *   numCols - number of cols in the grid
 */
var Tetris = function(canvas, infoPanel, numRows, numCols) {
	// Constant parameters (most of them)
	this.canvas = canvas;
	this.canvasContext = canvas.getContext('2d');
	this.numRows = numRows;
	this.numCols = numCols;
	this.cellWidth = canvas.width / numCols;
	this.cellHeight = canvas.height / numRows;

	// Game data
	this.score = 0;
	this.level = 1;
	this.numRowsCleared = 0;

	// Block data
	this.currentBlock = Block.createRandomBlock(Tetris.BLOCK_SPAWN_ROW, Tetris.BLOCK_SPAWN_COL);
	this.nextBlock = null;
	this.staticBlocks = []; // 2d array
	for (i = 0; i < this.numRows; i++) {
		this.staticBlocks[i] = new Array(this.numCols).fill(null);
	}

	// Info panel things
	this.infoPanel = infoPanel;
	if (infoPanel) {
		var nextBlockCanvas = infoPanel.find(Tetris.INFO_CANVAS_DOM_SELECTOR)[0];
		this.nextBlockInfo = new Tetris(nextBlockCanvas, null, Tetris.nextBlockInfo.NUM_ROWS,
			Tetris.nextBlockInfo.NUM_COLS);
		this.setNextBlock();
		this.setScore(this.score);
		this.setLevel(this.level);
	}

	// Timing and animation data
	this.msToFallOneRow = Tetris.BASE_TIME_PER_ROW;
	this.msInCurrentRow = 0;
	this.prevFrameTimestamp = null;
}

// Constants
Tetris.BLOCK_SPAWN_ROW = 0;
Tetris.BLOCK_SPAWN_COL = 4;

Tetris.GRIDLINE_COLOR = 'grey';
Tetris.BLOCK_BORDER_COLOR = 'black';
Tetris.CLEARED_BLOCK_COLOR = 'black';
Tetris.ROW_CLEAR_ANIMATION_LEN = 150;

Tetris.BASE_POINTS_PER_LINE_CLEAR = 100;
Tetris.POINT_MULTIPLIER_INCREASE_PER_LINE_CLEAR = 0.25; // Point multiplier for sumultaneous line clears
Tetris.POINT_MULTIPLIER_FACTOR_PER_LEVEL = 1.1; // Higher values = more score per level

Tetris.BASE_TIME_PER_ROW = 800;
Tetris.ROW_CLEARS_TO_ADVANCE_LEVEL = 6;
Tetris.SPEED_INCREASE_FACTOR_PER_LEVEL = 0.9; // Lower values = more speed for falling blocks per level

Tetris.nextBlockInfo = {
	NUM_ROWS: 2,
	NUM_COLS: 4,
	DRAW_ROW: 0,
	DRAW_COL: 1,
};
Tetris.INFO_CANVAS_DOM_SELECTOR = 'canvas'; // Selectors apply inside of the info panel only.
Tetris.LEVEL_DOM_SELECTOR = '.level';
Tetris.SCORE_DOM_SELECTOR = '.score';

/**
 * Main animation loop
 */
Tetris.prototype.run = function() {
	this.msInCurrentRow += this.getMsSinceLastFrame();
	var hadCollision = false;
	if (this.msInCurrentRow > this.msToFallOneRow) { // The top edge of the current block has passed a row boundary.
		this.msInCurrentRow = this.msInCurrentRow % this.msToFallOneRow;
		hadCollision = this.translateDownAndHandleCollisions();
	}

	if (!hadCollision) {
		var percentThroughRow = this.msInCurrentRow/this.msToFallOneRow;
		this.currentBlock.setYOffset(Math.round(this.cellHeight * percentThroughRow));
	}

	// Calculations done, time to draw a bunch of stuff!
	this.clearCanvas();
	this.drawGridLines();
	this.drawStaticBlocks();
	this.drawBlock(this.currentBlock);
	if (!this.hasValidLocation(this.currentBlock)) {
		this.drawGameOver();
		return;
	}

	window.requestAnimationFrame(this.run.bind(this));
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
 *
 * Returns: a boolean describing if a collision happened
 */
Tetris.prototype.translateDownAndHandleCollisions = function() {
	this.currentBlock.translateDown();
	if (!this.hasValidLocation(this.currentBlock)) {
		this.replaceCurrentBlock();
		this.animateAndTallyCompleteRows();
		this.msInCurrentRow = 0;
		return true;
	}
	return false;
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
 * Creates static blocks where the current block is and replaces the current block with a new one to fall from the top.
 */
Tetris.prototype.replaceCurrentBlock = function() {
	var currentBlock = this.currentBlock;
	for (i in currentBlock.occupiedSpaces) {
		var coordinate = currentBlock.occupiedSpaces[i];
		var row = coordinate.row;
		var col = coordinate.col;
		this.staticBlocks[row][col] = new Block('static', row, col, currentBlock.color);
	}
	this.currentBlock = this.nextBlock;
	this.setNextBlock();
}

/**
 * 1.  Animation: colors all complete rows a different color, and then after a short delay, clears them.
 * 2.  Increases score.
 * 3.  Might increase level.
 */
Tetris.prototype.animateAndTallyCompleteRows = function() {
	var numRowsCleared = 0;
	for (i = this.numRows - 1; i >= 0; i--) {

		if (this.staticBlocks[i].every(block => block != null)) {
			this.staticBlocks[i].every(block => block.color = Tetris.CLEARED_BLOCK_COLOR);
			numRowsCleared++;
		}
	}

	if (numRowsCleared) {
		this.setScore(this.score + this.calculatePointValue(numRowsCleared));
		this.numRowsCleared += numRowsCleared;
		this.setLevel(Math.floor(this.numRowsCleared / Tetris.ROW_CLEARS_TO_ADVANCE_LEVEL) + 1);
	}
	window.setTimeout(this.clearCompleteRows.bind(this), Tetris.ROW_CLEAR_ANIMATION_LEN);
}

/**
 * Clears all complete rows and translates rows above them down.
 */
Tetris.prototype.clearCompleteRows = function() {
	for (i = this.numRows - 1; i >= 0; i--) {

		if (this.staticBlocks[i].every(block => block != null)) {

			for (j = i; j >= 1; j--) { // Shift rows above rowLoc down
				this.staticBlocks[j] = this.staticBlocks[j - 1];
				this.staticBlocks[j].forEach( function(block) {
					if (block) {
						block.translateDown();
					}
				});
			}
			this.staticBlocks[0] = new Array(this.numCols).fill(null);
			i++; // Row i-1 was moved to row i, so we need to do this to compensate for the i-- in the for loop.
		}
	}
}

/**
 * Calculate the point value of a number of cleared rows.
 */
Tetris.prototype.calculatePointValue = function(numRowsCleared) {
	if (numRowsCleared <= 0) {
		return 0;
	}

	var pointMultiplier = 1;
	pointMultiplier += (numRowsCleared-1) * Tetris.POINT_MULTIPLIER_INCREASE_PER_LINE_CLEAR;
	pointMultiplier *= Math.pow(Tetris.POINT_MULTIPLIER_FACTOR_PER_LEVEL, this.level - 1)

	var pointsPerLine = Tetris.BASE_POINTS_PER_LINE_CLEAR * pointMultiplier;
	var points = Math.round(pointsPerLine * numRowsCleared);
	return points;
}

/**
 * Sets the score and updates the info panel.
 */
Tetris.prototype.setScore = function(score) {
	this.score = score;
	var scoreNode = this.infoPanel.find(Tetris.SCORE_DOM_SELECTOR);
	scoreNode.text(score);
}

/**
 * Sets the level, block falling speed, and updates the info panel.
 */
Tetris.prototype.setLevel = function(level) {
	this.level = level;
	var levelNode = this.infoPanel.find(Tetris.LEVEL_DOM_SELECTOR);
	levelNode.text(level);
	this.msToFallOneRow = Tetris.BASE_TIME_PER_ROW * Math.pow(Tetris.SPEED_INCREASE_FACTOR_PER_LEVEL, this.level - 1);
}

/**
 * Sets the next block to be a random block and updates the info panel.
 */
Tetris.prototype.setNextBlock = function() {
	this.nextBlock = Block.createRandomBlock(Tetris.BLOCK_SPAWN_ROW, Tetris.BLOCK_SPAWN_COL);
	var type = this.nextBlock.type;
	var color = this.nextBlock.color;
	var row = Tetris.nextBlockInfo.DRAW_ROW;
	var col = Tetris.nextBlockInfo.DRAW_COL;

	this.nextBlockInfo.clearCanvas();
	this.nextBlockInfo.drawBlock(new Block(type, row, col, color));
}

/**
 * Clears the main canvas.
 */
Tetris.prototype.clearCanvas = function() {
	this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

/**
 * Draws grid lines on the main canvas.
 */
Tetris.prototype.drawGridLines = function() {
	var ctx = this.canvasContext;
	ctx.strokeStyle = Tetris.GRIDLINE_COLOR;
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
 * Draws the specified block on the main canvas.
 */
Tetris.prototype.drawBlock = function(block) {
	var ctx = this.canvasContext;
	ctx.fillStyle = block.color;
	ctx.strokeStyle = Tetris.BLOCK_BORDER_COLOR;
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

/**
 * Draws a translucent "GAME OVER" screen over the entire canvas.
 */
Tetris.prototype.drawGameOver = function() {
	var ctx = this.canvasContext;
	ctx.fillStyle = 'rgba(255,255,255,0.7)';
	ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	ctx.fillStyle = 'black';
	ctx.font = 'bold 2.5em sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText("GAME OVER", Math.round(this.canvas.width/2), Math.round(this.canvas.height/2));
}

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
