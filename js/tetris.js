var Tetris = function(canvas, numRows, numCols) {
	// Constant parameters
	this.canvas = canvas;
	this.canvasContext = canvas.getContext('2d');
	this.numRows = numRows;
	this.numCols = numCols;
	this.cellWidth = canvas.width / numCols;
	this.cellHeight = canvas.height / numRows;

	// Game data and dynamic variables
	this.staticBlocks = []; // 2d array
	for (i = 0; i < numRows; i++) {
		this.staticBlocks.push([]);
	}
	this.msToFallOneRow = globals.INIT_MS_PER_ROW;
	this.msSoFar = 0;
	this.prevFrameTimestamp = null;
};

/**
 * Draw grid lines on the canvas that was provided when this Tetris' was created.
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

Tetris.prototype.draw = function() {
	var timestamp = performance.now();
	this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	this.drawGridLines();

	var timeSinceLastFrame = 0;
	if (this.prevFrameTimestamp !== null) {
		timeSinceLastFrame = timestamp - this.prevFrameTimestamp;
	}
	this.prevFrameTimestamp = timestamp;

	this.msSoFar += timeSinceLastFrame;
	if (this.msSoFar > this.msToFallOneRow) {
		var stopped = this.checkDownCollision();
		if (!stopped) {
			this.currentBlock.translateDown();
		}
		this.msSoFar = this.msSoFar - this.msToFallOneRow;
	}

	this.drawAllStaticBlocks();

	var percentThroughRow = this.msSoFar/this.msToFallOneRow;
	this.currentBlock.setYOffset(Math.round(this.cellHeight * percentThroughRow));

	this.currentBlock.draw();
	window.requestAnimationFrame(this.draw.bind(this));
};

Tetris.prototype.checkDownCollision = function() {
	var stop = false;

	var currRow = this.currentBlock.center.row;
	var currCol = this.currentBlock.center.col;
	if (currRow+1 >= this.numRows) {
		this.staticBlocks[currRow][currCol] = new Block(this, "asdf", currRow, currCol);
		this.currentBlock = new Block(this, "asdf", 0, 3);
		stop = true;
		console.log('stop!');
	}

	return stop;
};

Tetris.prototype.drawAllStaticBlocks = function() {
	this.staticBlocks.forEach( function(row) {
		row.forEach( function(col) {
			col.draw();
		});
	});
}
