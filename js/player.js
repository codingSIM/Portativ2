class Player {
	constructor(iniX, iniY) {
		this.iniX = iniX;
		this.iniY = iniY;
		this.w = 4 * 21 * unit;

		this.currY = iniY;
		this.extra;
		//CHANGE to this.y in drawObject
		this.y;

	}

	drawObject(){
		push();
		this.colMode();
		strokeWeight(6);

		this.movedKeys();

		//drawing the player
		this.y = this.currY + this.extra;
		triangle(this.iniX + unit, this.extra + this.currY, 
			this.iniX - 1 * unit, this.extra + this.currY + unit,
			this.iniX - 1 * unit, this.extra + this.currY - unit);
		triangle(this.iniX + this.w - unit , this.extra + this.currY, 
			this.iniX + this.w + 1 * unit, this.extra + this.currY + unit,
			this.iniX + this.w + 1 * unit, this.extra + this.currY - unit);
		strokeWeight(8);
		line(this.iniX+unit, this.extra + this.currY, this.iniX+this.w-unit, this.extra + this.currY);
		pop();
	}

	//if keys are hidden(H) the player moves
	movedKeys() {
		if (!showKeys) {
			this.extra = -(12 * unit);
		}
		else {
			this.extra = 0;
		}
	}

	//adjusting for dark/light theme
	colMode() {
		if (lightM) {
			stroke("#262626");
			fill("#262626");
		}
		else {
			stroke("#6a6a6a");
			fill("#6a6a6a");
		}
	}
}