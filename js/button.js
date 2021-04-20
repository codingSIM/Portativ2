class Button {
	constructor(x, y, bgcol, outline, shortcut, subtitle, effect = null, w = 100, h = 100 ) {
		this.x = x;
		this.y = y;
		this.col = bgcol;
		this.out = outline;

		this.t = shortcut;
		this.sub = subtitle;
		this.bt = "#333"; //black text
		this.wt = "#fff"; //white text

		this.w = w;
		this.h = h;

		this.effect = effect;
	}

	drawObject() {
		push();
		//drawing the outline rectangle and the name of the button
		stroke(this.out);
		strokeWeight(5);
		fill(this.col);
		rect(this.x, this.y, this.w, this.h, unit/2);
		noStroke();
		fill(this.out);
		textAlign(CENTER, CENTER);
		textSize(unit * 1);
		text(this.sub, this.x + 0.5 * this.w, this.y + 0.75 * this.h);

		//draws spacebar graphic
		if (this.t == "Space") {
			strokeWeight(4);
			stroke(this.bt);
			fill(this.wt);
			rectMode(CENTER);
			rect(this.x + 0.5 * this.w, this.y + 0.35 * this.h, unit*3.4, unit*1, unit/5);
			line(this.x + 0.45 * this.w, this.y + 0.32 * this.h, this.x + 0.55 * this.w, this.y + 0.32 * this.h)
		}

		//draws record graphic
		else if (this.t == "Dot") {
			strokeWeight(4);
			stroke(this.bt);
			fill(this.wt);
			ellipseMode(CENTER);
			ellipse(this.x + 0.5 * this.w, this.y + 0.35 * this.h, unit*2, unit*2);
			noStroke();
			if (recState == 1) { //recording
				fill("#ff3d3d");
			}
			else { //not recording
				fill("#858585");
			}
			ellipse(this.x + 0.5 * this.w, this.y + 0.35 * this.h, unit*1.2, unit*1.2)
		}

		//drawing the graphic for the theme button
		else if (this.t == "*") {
			push();
			let txt=null;
			fill(this.wt);
			noStroke();
			textSize(unit);
			translate(this.x+1/2*this.w, this.y+1/2*this.h);
			rotate(PI/2);
			textAlign(CENTER);
			if (lightM) {txt = "Light" }
			else {txt = "Dark" }
			text(txt, 0,0);
			pop();
		}
		
		//drawing shortcut graphic for keypressed (ex: key "H" / "M")
		else {
			textSize(unit*1.2);
			strokeWeight(4);
			stroke(this.bt);
			fill(this.wt);
			rectMode(CENTER);
			rect(this.x + 0.5 * this.w, this.y + 0.35 * this.h, unit*2, unit*2, unit/5);
			noStroke();
			fill(this.bt);
			text(this.t, this.x + 0.5 * this.w, this.y + 0.35 * this.h);
		}
		pop();
	}

	buttonClik() {
		this.effect();
	}
}

