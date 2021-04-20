//GLOBAL VARS
//0=bg; 1=outline;
var currentTheme = ["#FFF", "#2b2b2b"]; var lightM = false;
var unit = 20;

var notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var notesColor = ["#ff6161", "#ff9061", "#ffe761", "#c5ff61", "#76ff61", "#61ffb0", "#61ffef", "#61b3ff", "#6169ff", "#a861ff", "#d261ff", "#ff61ab"];
var octC = ["#ff8575", "#fff675", "#75ff95", "#75a8ff"];
var modes = ["sine", "triangle", "sawtooth", "square"]; var currentMode = 0;

var octaves;
var scrollSpeed = 0;

var screenNotes = new NotesArray();
var playingNotes = [];
var showKeys = true; var keyLock = false;

let recorder, soundFile, recState = 0;
let delMode = false;
let showInfo = false;
let clickEnabled = true;

//////////////SOUND FUNCTION
function calcFreq(n) {
	//Old function: (2**((n-49)/12)*440);
	return 16.35160 * ((2 ** (n / 12)));
	//C_zero = 16.35
	//n = octave * 12 + (index of semitone)
}
//////////////////////////////////////////////////

//May be useful for remodelling the project
function grid(x1, x2, col) {
	push();
	for (let i=0; i<143; i++) {
		stroke(col);
		strokeWeight(2);
		line(x1, i*unit/2, x2, i*unit/2);
		pop();

	}
	for (let i=0; i<43; i++) {
		line(x1+i*unit/2, 0, x1+i*unit/2, height);
	}
	pop();
}

// function preload() {
// 	bg = loadImage("p2.jpg");
// }

//initialising
function setup() {
	canvas = createCanvas(windowWidth,windowHeight);
	octaves = [];
	octaves.push(new Octave(currentTheme, 4, 180, 80));
	octaves.push(new Octave(currentTheme, 5, 600, 80));
	octaves.push(new Octave(currentTheme, 6, 1020, 80));
	octaves.push(new Octave(currentTheme, 7, 1440, 80));

	notePlacements = [];
	notePlacements.push(new notePlacement(180, 4, height, 2*height));
	notePlacements.push(new notePlacement(600, 5, height, 2*height));
	notePlacements.push(new notePlacement(1020, 6, height, 2*height));
	notePlacements.push(new notePlacement(1440, 7, height, 2*height));

	buttons = [];
	buttons.push(new Button(20, 20, "#bf96ff", "#6625aa", "H", "Hide", hideBtn));
	buttons.push(new Button(20, 130, "#fe96e1", "#ab2586", "M", "Mode", modeBtn));
	buttons.push(new Button(20, 240, "#fe96a3", "#ab2535", "Space", "Play", playBtn));
	buttons.push(new Button(20, 350, "#feac83", "#d96442", "R", "Reset", resetBtn));
	buttons.push(new Button(20, 460, "#fee196", "#d9b222", "S", "Save", saveBtn));
	buttons.push(new Button(20, 570, "#b9fe96", "#4eab25", "L", "Load", showInputBox));
	buttons.push(new Button(20, 680, "#96e9fe", "#259cab", "Dot", "Record", recordBtn));
	buttons.push(new Button(20, 790, "#96b1fe", "#2550ab", "I", "Info", infoBtn));
	buttons.push(new Button(width - 45, 30, "#696969", "#aaa", "*", "", themeBtn, 35, 80));
 
	player = new Player(9 * unit, 18 * unit);

	octaveBtns = [];
	for (let i = 0; i < octaves.length; i++) {
		octaveBtns.push(new changeOctaveBtn((i) * 420 + 180, 20, 4+i, octaves[i], octC[i]));
	}

	// initialising recorder
	recorder = new p5.SoundRecorder();
	soundFile = new p5.SoundFile();
	userStartAudio();

	//in order to be able to record the sketch sounds, when nothing is playing
	//we need an oscillator to be constantly playing
	let startSound = new p5.Oscillator(modes[currentMode]); //You can change the type of Oscillator here
	startSound.freq(400);
	startSound.amp(0);
	startSound.start();

}



function draw() {
	//light/dark theme bg
	if (lightM) {
		background("#f1f1f1");
	}
	else {
		background("#0b0b0b");
	}

	//https://github.com/processing/p5.js/issues/3035
	canvas.drawingContext.miterLimit = 2; //fixes issue with rendering text with a bigger stroke

	//Drawing note placements
	for (var i = 0; i < notePlacements.length; i++) {
		notePlacements[i].drawObject();
	}

	//Notes that exist to be played
	for (var i = 0; i < screenNotes.length; i++) {
		let currentNote = screenNotes.arr[i];
		currentNote.y-=scrollSpeed;
		currentNote.drawObject();

		if(currentNote.y > player.extra + player.currY && currentNote.y <= player.extra + player.currY + scrollSpeed) {
			playingNotes.push(
				new PlayingNote(calcFreq((octaves[currentNote.octave].oct) * 12 + currentNote.semitone + 1), 1, octaves[currentNote.octave].oct, currentNote.octave, currentNote.semitone + 1)
			);
		}
	}

	for (var i = 0; i < octaveBtns.length; i++) {
		octaveBtns[i].drawObject();
	}

	for (var i = 0; i < playingNotes.length; ) {
		let note = playingNotes[i];
		if (note.tick()) { //true to remove
			playingNotes.splice(i, 1);
		} else {
			i++;
		}
	}

	//drawing the buttons
	for (var i=0; i < buttons.length; i++) {
		buttons[i].drawObject();
	}

	player.drawObject();

//Buttons extra side graphic
	//drawing a lock on the HIDE button
	if (keyLock) {
		push();
		fill("#c375ff");
		noStroke();
		rect(6.5*unit, 3.5*unit, 1.5*unit, 1*unit);
		noFill();
		stroke("#c375ff");
		strokeWeight(6);
		arc(7.25*unit, 3.5*unit, 1*unit, 1.6*unit, PI, 2*PI);
		pop();
	}

	//showing or hiding the keys
	if (showKeys){
		for (var i = 0; i < octaves.length; i++) {
			octaves[i].drawObject();
		}
	}

	//drawing the current mode for the MODE button
	push();
	noStroke();
	textSize(unit);
	translate(7*unit, 9*unit);
	rotate(PI/2);
	textAlign(CENTER);
	fill("#ff75c3");
	text(modes[currentMode], 0, 0);
	pop();


	//drawing the current state of the player
	push();
	//paused
	if (scrollSpeed == 0) {
		fill("#ff8575");
		noStroke();
		triangle(6.75*unit, 13.5*unit,
				6.75*unit, 15.5*unit,
				8*unit, 14.5*unit);
	}
	//playing
	if (scrollSpeed != 0) {
		noStroke();
		fill("#ff8575");
		rect(6.75*unit, 13.5*unit, 0.45*unit, 2*unit);
		rect(7.5*unit, 13.5*unit, 0.45*unit, 2*unit);
	}
	pop();

	//telling the user that next press of the button record will save it
	//"Save?"
	if (recState == 2) {
		push();
		noStroke();
		textSize(unit*1);
		translate(7*unit, 36.5*unit);
		rotate(PI/2);
		textAlign(CENTER);
		fill("#259cab");
		text("Save?", 0, 0);
		pop();
	}

	informat();
//END of buttons side graphic
}


function mouseClicked(){
	//if click isn't enabled then it won't let the user interact with the sketch by clicking
	if(!clickEnabled) return;

	//State: User can place notes.
	if (!delMode) {
		//can place notes if below the player on the screen
		if (mouseY > player.y) {
			for (var i = 0; i < notePlacements.length; i++) {
				if (notePlacements[i].onLine()){
					let semi = notePlacements[i].onLine();
					//click note, plays the note that the user just put on the screen
					clikNote = new Note(i, semi, mouseY);
					screenNotes.push(clikNote);
					playingNotes.push(
						new PlayingNote(calcFreq((octaves[clikNote.octave].oct) * 12 + clikNote.semitone + 1), 1, octaves[clikNote.octave].oct, clikNote.octave, clikNote.semitone + 1)
					);
				}
			}
		}
	}

	//State: User can delete notes from the screen.
	else if (delMode){
		for (var i = 0; i < screenNotes.length; i++) {
			if (dist(mouseX, mouseY, screenNotes.arr[i].x, screenNotes.arr[i].y) < 1*unit) {
				//note gets deleted from the array
				screenNotes.arr.splice(i, 1);
			}
		}
	}

	//Clicking on the left / right arrow to change the octave nr at the top
	for (var i = 0; i < octaveBtns.length; i++) {
		if ((mouseY > octaveBtns[i].y + 0.5 * unit) && (mouseY < octaveBtns[i].y + 2.5 * unit)) {
			//left button
			if ((mouseX > octaveBtns[i].x + 5 * unit) && (mouseX < octaveBtns[i].x + 8 * unit)) {
				if (octaveBtns[i].curr <= 0) {octaveBtns[i].curr = 0}
				else {
					octaveBtns[i].curr-=1;
					octaveBtns[i].octaveObj.oct -= 1;
				}

			}
			//right button
			else if ((mouseX > octaveBtns[i].x + 13 * unit) && (mouseX < octaveBtns[i].x + 16 * unit)) {
				if (octaveBtns[i].curr >= 64) {octaveBtns[i].curr=64}
				else {
					octaveBtns[i].curr+=1;
					octaveBtns[i].octaveObj.oct += 1;
				}
			}
		}
	}

	//Menu buttons click
	for (var i = 0; i < buttons.length; i++) {
		if ((mouseX > buttons[i].x) && (mouseX < buttons[i].x + buttons[i].w)) {
			if ((mouseY > buttons[i].y) && (mouseY < buttons[i].y + buttons[i].h)) {
				buttons[i].buttonClik();
			}
		}
	}
}

//Resizes canvas to fit
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

//moves the notes up and down the canvas
function mouseWheel(event) {
	for (let i=0; i<screenNotes.length; i++) {
		screenNotes.arr[i].y += event.delta*unit;
	}
}

function keyPressed() {
	//F FULLSCREEN
	var fs = fullscreen();
	if (keyCode == 70) {
		fullscreen(!fs);
	}
	//Spacebar play / pause
	if ((keyCode == 32)) {
		playBtn();
	}
	//H toggle keys
	if (keyCode == 72) {
		hideBtn();
	}
	//M mode change
	if (keyCode == 77) {
		modeBtn();
	}
	//R resets the notes
	if (keyCode == 82) { 
		resetBtn();
	}
	//S save txt
	if (keyCode == 83) { //save txt
		saveBtn();
	}
	//C clear
	if (keyCode == 67) { 
		screenNotes.arr = [];
	}
	//L load
	if (keyCode == 76) {
		showInputBox();
	}
	//I info
	if (keyCode == 73) {
		infoBtn();
	}
	//D toggle delete mode
	if (keyCode == 68) {
		if (!delMode) {
			delMode = true;
		}
		else {
			delMode = false;
		}
	}
}


function changeVar(variable, v1, v2) {
	if (variable == v1) {
		return v2;
	}
	else if (variable == v2) {
		return v1;
	}
}


/////////////Button functions:
function hideBtn() {
	if (!keyLock) {
		showKeys =! showKeys;
	}
}

function modeBtn() {
	if (currentMode == 3) {
		currentMode = 0;
	}
	else {
		currentMode+=1;
	}
}

function playBtn() {
	scrollSpeed = changeVar(scrollSpeed, 0, 5);
	if (scrollSpeed == 0) {
		keyLock = false;
	}
	if (scrollSpeed != 0) {
		keyLock = true;
	}
}

function resetBtn() {
	if (screenNotes.arr[0].y > player.y) {
		resetLength = (player.y + 3 * unit) - screenNotes.arr[0].y;
	}
	else {
		resetLength = -(screenNotes.arr[0].y - (player.y + 3 * unit));
	}
	for (var i = 0; i < screenNotes.length; i++) {
		screenNotes.arr[i].y+=resetLength;
	}
}

function recordBtn() {
	console.log("pressed crnt state: " + recState);
	if (recState == 0) {
		recorder.record(soundFile);
		recState++;
		console.log("Record started.");
	}
	else if (recState == 1) {
		recorder.stop();
		recState++;
		console.log("Recording stopped...");
	}
	else if (recState == 2) {
		//soundFile.play();
		save(soundFile, "mySound3.wav");
		recState = 0;
		console.log("SAVED...");
	}
}

function infoBtn() {
	showInfo = changeVar(showInfo, showInfo, !showInfo);
}

function gridBtn() {
	image(bgimg, 0, 0);
}

function informat() {
	if (showInfo) {
		let title = "Information"
		let txt = 
		`
		Notes go up in semitones. Use the arrows at the top of the 
		keys to change the value of the octaves.
		
		Listed Buttons:

		1. Hide - Hides / Shows the keys .
		2. Mode - Changes the mode of the sound.
		3. Play - Play / Pause.
		4. Reset - Resets notes to first playable note.
		5. Save - Saves the current screen notes to a txt file which
		can be loaded back in.
		6. Load - Opens pop-up, browse screenNotes.txt file to load.
		7. Record - 1st - starts recording, 2nd - stops recording, 
		3rd - saves recording. (and repeat)
		8. Info - Shows information about the keys.

		Unlisted:

		9. C - Pressing C clears all notes.
		10. D - Enter / Exit Delete mode. (click on notes to delete)
		11. Scrolling - moves notes up or down. 
		12. F - Fullscreen toggle.
		`

		push();
		stroke("#2550ab");
		strokeWeight(10);
		fill("#96b1fe");
		rectMode(CENTER);
		rect(width/2, height/2, unit*30, unit*36, unit);
		fill("#333");
		textAlign(LEFT);
		noStroke();
		textSize(1*unit);
		text(txt, width/2 - 14.5*unit, height/2 - 14.5*unit);
		textSize(2*unit);
		text(title, width/2 - 13.5*unit, height/2 - 15*unit);
		pop();
	}
}

function saveBtn() {
	let writer = createWriter("screenNotes.txt");
	let jsonData = {};
	for (let i = 0; i<screenNotes.length; i++) {
		jsonData[i] = {};
		jsonData[i]["octave"] = screenNotes.arr[i].octave;
		jsonData[i]["semitone"] = screenNotes.arr[i].semitone + 1;
		jsonData[i]["y"] = screenNotes.arr[i].y;
	}
	jsonData["length"] = screenNotes.length;
	writer.write([JSON.stringify(jsonData)]);
	console.log(JSON.stringify(jsonData));
	writer.close();
}

function showInputBox() {
	document.getElementById("PopUpTextbox").classList.remove("closed");
	clickEnabled = false;
}

function loadFile() {
	loadText(document.getElementById("browse").files[0]);
}

function loadText(file) {
	console.log(file);
	if (file.type === "text/plain") {
		file.text().then(text => continueLoadText(text));
	} else {
		//not txt file
		alert("Not text file. Select a (\"screenNotes\".txt)")
	}
}

function continueLoadText(jsonString) {
	//console.log(jsonString);
	try {
		let json = JSON.parse(jsonString);
		screenNotes.arr = [];
		console.log(json);
		for (var i = 0; i < json.length; i++) {
			console.log(json[i]);
			screenNotes.push(new Note(json[i]["octave"], json[i]["semitone"], json[i]["y"]));
		}
	} catch {
		alert("Error parsing file. Try selecting a screenNotes.txt.");
	}
	closeTxt();
}

function closeTxt() {
	document.getElementById("PopUpTextbox").classList.add("closed");
	setTimeout(function() {clickEnabled = true;}, 50);
}

function themeBtn() {
	lightM = !lightM;
}
//////////////////////////////////////////////////////