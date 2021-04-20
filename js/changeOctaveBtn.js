class changeOctaveBtn {
	constructor(x, y, octaveNr, octaveObj, col) {
		this.x = x;
		this.y = y;
		this.curr = octaveNr;
		this.w = 21 * unit;
		this.h = 3 * unit;
		this.octaveObj = octaveObj;

		this.c = col;
	}

	drawObject() {
		push();
		stroke("#262626");
		strokeWeight(4);
		fill(this.c);
		rect(this.x, this.y, this.w, this.h, 1/2*unit, 1/2*unit, 0, 0);

		//center of shape
		this.centerX = this.x + 1/2 * this.w;
		this.centerY = this.y + 1/2 * this.h;

		//drawing the arrows
		fill("#fff");
		strokeWeight(2);
		rectMode(CENTER);

		//button shapes
		rect(this.centerX - 4 * unit, this.centerY, 3 * unit, 2 * unit, unit / 4);
		ellipse(this.centerX, this.centerY, unit * 2.4);
		rect(this.centerX + 4 * unit, this.centerY, 3 * unit, 2 * unit, unit / 4);

		fill("#363636");
		triangle(this.centerX - 4.5 * unit, this.centerY,
			this.centerX - 3.5 * unit, this.centerY + 1/2 * unit,
			this.centerX - 3.5 * unit, this.centerY - 1/2 * unit);
		triangle(this.centerX + 4.5 * unit, this.centerY,
			this.centerX + 3.5 * unit, this.centerY + 1/2 * unit,
			this.centerX + 3.5 * unit, this.centerY - 1/2 * unit);

		//drawing the current octave number
		noStroke();
		textSize(unit * 1.5);
		textAlign(CENTER, CENTER);
		text(this.curr, this.centerX, this.centerY);

		pop();
	}
}