//this class draws the lines behind the keys and also shows where a note would be 
//placed on the line if the mouse is clicked .onLine method
class notePlacement {
	constructor(x, octaveNr, hUp, hDown){
		this.x = x;
		this.hUp = hUp;
		this.hDown = hDown;

		this.hToPlace = 16 * unit;
		this.clik = false;
		
		this.tolerence = 0.75;
		this.alpha = 120;

		this.octaveNr = octaveNr;
	}

	drawObject(){
		//drawing the lines on which the notes stay on 
		push();
		this.dashedLine(this.x + 6 * 1.5 * unit, -this.hUp, this.hDown, 100);
		this.colMode();
		for (var i = 1; i < 6; i++) {
			strokeWeight(4);
			let whereIsX = this.x + 1.5 * i * unit;
			line(whereIsX, -this.hUp, whereIsX, this.hDown);

			if(Math.abs(mouseX - whereIsX) < unit * this.tolerence) {
				strokeWeight(4);
				this.col = color(notesColor[i-1]);
				(this.col).setAlpha(this.alpha); //sets alpha of hovering over note
				fill(this.col);
				ellipse(whereIsX, mouseY, 1.5*unit);
			}
		}

		for (var i = 1; i < 8; i++) {
			strokeWeight(4);

			let whereIsX = this.x + 1.5 * (6 + i) * unit;
			line(whereIsX, -this.hUp, whereIsX, this.hDown);

			if(Math.abs(mouseX - whereIsX) < unit * this.tolerence) {
				strokeWeight(4);
				this.col = color(notesColor[i+4]);
				(this.col).setAlpha(this.alpha);//sets alpha of hovering over note
				fill(this.col);
				ellipse(whereIsX, mouseY, 1.5*unit);
			}
		}
		pop();
	}

	//Returns the line that the mouse is on, otherwise returns false.
	onLine() {
		for (var i = 1; i < 6; i++) {
			let whereIsX = this.x + 1.5 * i * unit;
			if(Math.abs(mouseX - whereIsX) < unit * this.tolerence) {
				return i;
			}

		}

		for (var i = 1; i < 8; i++) {
			let whereIsX = this.x + 1.5 * (6 + i) * unit;
			if(Math.abs(mouseX - whereIsX) < unit * this.tolerence) {
				return i + 5;
			}
		}
		return false;
	}

	//drawing a dashed line
	dashedLine(x1, y1, y2, segments){
		this.colMode();
		strokeWeight(3);
		this.lineSeg = (y2 - y1) / segments;
		for (var i = 0; i < segments; i++) {
			line(x1, y1 + (i * 2) * this.lineSeg, x1, y1 + this.lineSeg * ((i * 2) + 1));	
		}
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