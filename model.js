


function Model() {
    this.tracks = [];
}

Model.prototype.AddNote(track, beat, noteData) {
    tracks[track].addNote(beat, noteData);
}





function Track(trackData) {
    this.trackData = trackData;
    this.notes = [];
}

Track.prototype.AddNote(beat, noteData) {
    var n = new Note(noteData);
    if (!notes[beat]) {
        notes[beat] = [];
    }
    notes[beat].append(n);
}




function Note(noteData) {
    this.noteData = noteData;
}
