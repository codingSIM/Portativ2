class PlayingNote {
	constructor(freq, duration, oct, realOct, semitone) {
		this.freq = freq;
		this.oct = oct;
		this.semi = semitone;
		//duration set to duration or 1
		this.duration = duration ? duration : 1;
		this.realOct = realOct;

		this.initialVolume = 0.3;
		this.fadeDuration = 0.4;

		this.fadeFrames = -this.fadeDuration * 60;

		//note start
		this.osc = new p5.Oscillator(modes[currentMode]); //You can change the type of Oscillator here
		this.osc.freq(this.freq);
		this.osc.amp(this.initialVolume);
		this.osc.start();

	}

	tick() {
		this.duration--;
		if (this.duration == 0) {
			this.osc.amp(0, this.fadeDuration);
			octaves[this.realOct].keys[this.semi-1].active=true;
			return false;
		//stopping the note
		} else if (this.duration < this.fadeFrames) {
			this.osc.stop();
			this.osc = null; //delete osc
			octaves[this.realOct].keys[this.semi-1].active=false;
			return true;
		} else {
			return false;
		}
	}
}