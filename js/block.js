var Block = function(tetris, type, center, color) {
	this.tetris = tetris;
	this.type = type;
	this.center = center;
	this.color = color;
	this.yOffset = 0;
};

/**
 * Draw this block on the canvas that was provided when the block was created.
 */
Block.prototype.draw = function() {
	var ctx = this.tetris.canvasContext;
	var cellWidth = this.tetris.cellWidth;
	var cellHeight = this.tetris.cellHeight;
	var canvasX = this.center.col * cellWidth;
	var canvasY = this.center.row * cellHeight;
	ctx.fillStyle = this.color;
	ctx.fillRect(canvasX, canvasY + this.yOffset, cellWidth, cellHeight);
}

/**
 * Translates this block a number of pixels up or down when this block's draw() method is called.  Positive numbers
 * translate the block down, and negative ones translate it up.
 */
Block.prototype.setYOffset = function(offset) {
	this.yOffset = offset;
}

/**
 * Moves this block down one row
 */
Block.prototype.translateDown = function() {
	this.center.row += 1;
}

/**
 * Moves this block left one column
 */
Block.prototype.translateLeft = function() {
	this.center.col -= 1;
}

/**
 * Moves this block right one column
 */
Block.prototype.translateRight = function() {
	this.center.col += 1;
}
