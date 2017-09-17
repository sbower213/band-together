
function Model() {
  this.beat = 0; // beats are 16th notes for now. so tempo / 4 is a beat.
  this.playInterval = null;
  this.tempo = 120.0; // bpm
  this.tracks = [];
  this.trackLength = 16; // steps
}

Model.prototype.addNote = function(track, beat, noteData) {
    this.tracks[track].addNote(beat, noteData);
};

Model.prototype.deleteNote = function(track, beat, pitch) {
    tracks[track].deleteNote(beat, pitch);
};

Model.prototype.addTrack = function(instrument, index) {
  this.tracks[index] = new Track(new TrackData(instrument, this.tempo));
};

Model.prototype.modifyTrack = function(index, trackData) {

};

Model.prototype.deleteTrack = function(index) {

};

Model.prototype.projectSettings = function(settings) {

};

Model.prototype.pause = function() {
  if (this.playInterval) {
    clearInterval(this.playInterval);
    this.playInterval = null;
  }
};

Model.prototype.play = function() {
  if (this.playInterval) {
    return;
  }
  // TODO: probably not a good way to do this. Should keep time using current
  // time to minimize time drift
  this.playInterval = setInterval(
    function() {
      for (let i = 0; i < this.tracks.length; i++) {
	this.tracks[i].play(this.beat);
      }
      this.beat = (this.beat + 1) % this.trackLength;
    }.bind(this),
    1.0 / this.tempo / 4.0 * 60.0 * 1000.0,
  );
};

Model.prototype.stop = function() {
  this.pause();
  this.beat = 0;
};



function Track(trackData) {
    this.trackData = trackData;
    this.notes = [];
};

Track.prototype.addNote = function(beat, notedata) {
    var n = new Note(notedata);
    if (!this.notes[beat]) {
        this.notes[beat] = [];
    }
    this.notes[beat].push(n);
};

Track.prototype.deleteNote = function(beat, pitch) {

};

Track.prototype.play = function(beat) {
  if (!this.notes[beat]) {
    return;
  }
  for (let i = 0; i < this.notes[beat].length; i++) {
    this.trackData.instrument.play(
      this.notes[beat][i].noteData.pitch,
      this.notes[beat][i].noteData.duration / 4.0 / this.trackData.tempo * 60.0, // convert to secs
    ); // Assume this is common interface among instruments
  }
}


function TrackData(instrument, tempo) {
  this.instrument = instrument;
  this.tempo = tempo;
};



function Note(noteData) {
    this.noteData = noteData;
};



function NoteData(pitch, duration) {
  this.pitch = pitch; // MIDI value
  this.duration = duration; // in "beats"
};


// Test functions
function testModel() {
  let model = new Model();
  let synth = new Synth('square', 'square');
  synth.offset = 1200;
  model.addTrack(synth, 0);

  model.addNote(0, 0, new NoteData(60, 2));
  model.addNote(0, 0, new NoteData(64, 2));

  model.addNote(0, 4, new NoteData(64, 2));
  model.addNote(0, 4, new NoteData(67, 2));

  model.addNote(0, 8, new NoteData(67, 4));
  model.addNote(0, 8, new NoteData(71, 4));

  model.addNote(0, 12, new NoteData(64, 2));
  model.addNote(0, 12, new NoteData(67, 2));

  model.play();
}

function testDrums() {
  let model = new Model();
  let drums = new Drums();
  model.addTrack(drums, 0);

  // kick
  model.addNote(0, 0, new NoteData(0, 1));
  model.addNote(0, 4, new NoteData(0, 1));
  model.addNote(0, 8, new NoteData(0, 1));
  model.addNote(0, 12, new NoteData(0, 1));

  // clap
  model.addNote(0, 4, new NoteData(1, 1));
  model.addNote(0, 12, new NoteData(1, 1));

  // hi hat
  model.addNote(0, 0, new NoteData(3, 1));
  model.addNote(0, 2, new NoteData(3, 1));
  model.addNote(0, 4, new NoteData(3, 1));
  model.addNote(0, 6, new NoteData(3, 1));
  model.addNote(0, 8, new NoteData(3, 1));
  model.addNote(0, 10, new NoteData(3, 1));
  model.addNote(0, 12, new NoteData(3, 1));
  model.addNote(0, 14, new NoteData(3, 1));

  // melody
  let synth = new Synth('square', 'square');
  synth.offset = 1200;
  model.addTrack(synth, 1);
  
  model.addNote(1, 0, new NoteData(60, 2));
  model.addNote(1, 0, new NoteData(64, 2));
  
  model.addNote(1, 2, new NoteData(64, 1));
  model.addNote(1, 2, new NoteData(67, 1));
  
  model.addNote(1, 3, new NoteData(71, 1));
  model.addNote(1, 3, new NoteData(74, 1));
  
  model.addNote(1, 4, new NoteData(67, 8));
  model.addNote(1, 4, new NoteData(71, 8));
  
  model.play();
}
