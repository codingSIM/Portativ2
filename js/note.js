class Note {
	constructor(octave, semitone, y){
		this.octave = octave;
		this.semitone = semitone - 1;
		this.y = y;

		this.color = notesColor[semitone -1];

		//start + adjust for c + adjust for octave + adjust per semitone
		this.x = 180 + (420 * octave) + (1.5 * unit * semitone);

		//adjust for missing note (dotted line)
		this.x += semitone > 5 ? 1.5 * unit : 0;

		this.active = false;
	}

	//drawing the note
	drawObject(){
		push();
		strokeWeight(4);
		this.colMode();
		fill(this.color);
		ellipse(this.x, this.y, 1.5 * unit);
		pop();
	}

	//adjusting for dark/light theme
	colMode() {
		if (lightM) {
			stroke("#8a8a8a")
		}
		else {
			stroke("#262626");
		}
	}
}