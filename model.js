


function Model() {
    this.tracks = [];
}

Model.prototype.addNote = function(track, beat, pitch, noteData) {
    tracks[track].addNote(beat, pitch, noteData);
};

Model.prototype.deleteNote = function(track, beat, pitch) {
    tracks[track].deleteNote(beat, pitch);
};

Model.prototype.addTrack = function(index) {
    
};

Model.prototype.modifyTrack = function(index, trackData) {

};

Model.prototype.deleteTrack = function(index) {

};

Model.prototype.projectSettings = function(settings) {

};



function Track(trackData) {
    this.trackData = trackData;
    this.notes = [];
}

Track.prototype.addNote = function(beat, pitch, noteData) {
    var n = new Note(noteData);
    if (!notes[beat]) {
        notes[beat] = [];
    }
    notes[beat].append(n);
};

Track.prototype.deleteNote = function(beat, pitch) {

};


function Note(noteData) {
    this.noteData = noteData;
}
