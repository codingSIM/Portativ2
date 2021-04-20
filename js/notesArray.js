//sorting notes array (ascending y value)
class NotesArray {
	constructor() {
		this.arr = [];
	}

	//adding note to the array (in the right position)
	push(note) {
		let index = this.findIndex(note);
		console.log(index);
		this.arr.splice(index, 0, note);
	}

	//recursive binary search for the index of the new push item
	findIndex(note, start=0, end=null) {
		if (end == null) {
			end = this.arr.length;
		}

		if (start == end) {
			return start;
		}

		let pivot = floor((start+end)/2);

		if (this.arr[pivot].y > note.y) {
			return this.findIndex(note, start, pivot);
		}

		else if (this.arr[pivot].y < note.y) {
			return this.findIndex(note, pivot + 1, end);
		}

		else {
			return pivot;
		}
	}

	//returns length
	get length() {
		return this.arr.length;
	}
}