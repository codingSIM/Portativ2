class Octave{
	constructor(currentTheme, octaveNr, iniX, iniY){
		this.theme=currentTheme;
		this.iniX=iniX;
		this.iniY=iniY;
		this.oct=octaveNr;

		this.WhiteKeys=[];
		this.BlackKeys=[];
		this.keysXDiff=[0, 3, 3, 6, 6, 9, 12, 12, 15, 15, 18, 18];
		this.keys=[];

		//adding keys to the different arrays
		for (var i = 0; i < notes.length; i++) {
			let newKey=new Key(this.iniX+(unit*this.keysXDiff[i]), iniY, i);
			if (notes[i].includes("#")) {
				this.BlackKeys.push(newKey);
				this.keys.push(newKey);
			}
			else{
				this.WhiteKeys.push(newKey);
				this.keys.push(newKey);
			}

		}
	}
	//drawing a full octave
	drawObject(){
		push();
		for (var i = 0; i < this.WhiteKeys.length; i++) {
			this.WhiteKeys[i].drawObject();
		}
		for (var i = 0; i < this.BlackKeys.length; i++) {
			this.BlackKeys[i].drawObject();
		}
		pop();

	}
}