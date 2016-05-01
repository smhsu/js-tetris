/***
 * coordinate.js
 * Silas Hsu
 ***/

/**
 * Creates a tuple representing a grid location.
 */
var Coordinate = function(row, col) {
	this.row = row;
	this.col = col;
};

/**
 * Returns a new coordinate rotated around the specified coordinate, either clockwise or counterclockwise 90 degrees.
 * Parameters:
 *   center - center of rotation
 *   direction - either "clockwise" or "counterclockwise".  If niether of these, then returns an unmodified point.
 */
Coordinate.prototype.rotated90DegreesAround = function(center, direction) {
	// Translate so we are working around (0, 0)
	var translatedRow = this.row - center.row;
	var translatedCol = this.col - center.col;

	// Rotate around the origin
	var rotatedRow;
	var rotateCol;
	if (direction == "clockwise") {
		rotatedRow = translatedCol;
		rotatedCol = -translatedRow;
	} else if (direction == "counterclockwise") {
		rotatedRow = -translatedCol;
		rotatedCol = translatedRow;
	} else {
		rotatedRow = translatedRow;
		rotateCol = translatedCol;
	}

	// Translate back to the original location.
	var finalRow = rotatedRow + center.row;
	var finalCol = rotatedCol + center.col;

	return new Coordinate(finalRow, finalCol);
}
