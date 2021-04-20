class Key{
	constructor(x, y, index){
		this.x = x;
		this.y = y;
		this.i = index;

		this.active = false;

		this.strokeCol = null;
		this.fillCol = null;
	}

	// drawing white key
	whiteKey(){
		if (!this.active) {
			this.strokeCol=currentTheme[1];
			this.fillCol=currentTheme[0];
		}
		//if the key is active it lights up with the note's colour
		else {
			this.strokeCol=currentTheme[1];
			this.fillCol=notesColor[this.i];
		}
		stroke(this.strokeCol);
		strokeWeight(4);
		fill(this.fillCol);
		rect(this.x, this.y, 3 * unit, 12 * unit);
		//drawing name of key
		noStroke();
		fill(this.strokeCol);
		textSize(unit);
		textAlign(CENTER);
		text(notes[this.i], this.x + 1.5 * unit, this.y + 11 * unit);
	}

	// drawing a black key
	blackKey(){
		if (!this.active) {
			this.strokeCol = currentTheme[0];
			this.fillCol = "#333";
			this.outline = currentTheme[1];
		}
		//if the key is active it lights up with the note's colour
		else {
			this.strokeCol = currentTheme[1];
			this.fillCol = notesColor[this.i];
			this.outline = currentTheme[1];
		}
		stroke(this.outline);
		strokeWeight(4);
		fill(this.fillCol);
		rect(this.x - unit, this.y, 2 * unit, 8 * unit);
		//drawing name of key
		noStroke();
		fill(this.strokeCol);
		textSize(unit);
		textAlign(CENTER);
		text(notes[this.i], this.x, this.y + 7 * unit);
	}

	// drawing either a black or white key
	drawObject(){
		if (notes[this.i].includes("#")) {
			this.blackKey();
		}
		else {
			this.whiteKey();
		}
	}
}