
function Model() {
  this.beat = 0; // beats are 16th notes for now. so tempo / 4 is a beat.
  this.playInterval = null;
  this.tempo = 120.0; // bpm
  this.tracks = {};
  this.trackLength = 16; // steps

  this.addNoteListeners = [];
  this.deleteNoteListeners = [];
  this.addTrackListeners = [];
  this.modifyTrackListeners = [];
  this.deleteTrackListeners = [];
  this.projectSettingsListeners = [];
}

Model.prototype.registerAddNoteListener = function(fn){
    this.addNoteListeners.push(fn);
}

Model.prototype.registerDeleteNoteListener = function(fn) {
    this.deleteNoteListeners.push(fn);
}

Model.prototype.registerAddTrackListener = function(fn) {
    this.addTrackListeners.push(fn);
}

Model.prototype.registerModifyTrackListener = function(fn) {
    this.modifyTrackListeners.push(fn);
}

Model.prototype.registerDeleteNoteListener = function(fn) {
    this.deleteTrackListeners.push(fn);
}

Model.prototype.registerProjectSettingsListener = function(fn) {
    this.projectSettingsListeners.push(fn);
}

Model.prototype.addNote = function(track, beat, noteData) {
    this.tracks[track].addNote(beat, noteData);

    for (var i = 0; i < this.addNoteListeners.length; i++) {
        this.addNoteListeners[i](track, beat, noteData);
    }
};

Model.prototype.deleteNote = function(track, beat, pitch) {
    tracks[track].deleteNote(beat, pitch);

    for (var i = 0; i < this.deleteNoteListeners.length; i++) {
        this.deleteNoteListeners[i](track, beat, pitch);
    }
};

Model.prototype.addTrack = function(index, trackData) {
  this.tracks[index] = new Track(trackData);

  for (var i = 0; i < this.addTrackListeners.length; i++) {
      this.addTrackListeners[i](index, trackData);
  }
};

Model.prototype.modifyTrack = function(index, trackData) {
    for (var i = 0; i < this.modifyTrackListeners.length; i++) {
        this.modifyTrackListeners[i](index, trackData);
    }
};

Model.prototype.deleteTrack = function(index) {
    for (var i = 0; i < this.deleteTrackListeners.length; i++) {
        this.deleteTrackListeners[i](index);
    }
};

Model.prototype.projectSettings = function(settings) {
    for (var i = 0; i < this.projectSettingsListeners.length; i++) {
        this.projectSettingsListeners[i](settings);
    }
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

    if (this.trackData.instrument.name == "synth") {
        this.instrument = new Synth('square', 'square');
        this.instrument.offset = this.trackData.instrument.offset;
        this.instrument.mix = this.trackData.instrument.mix;
    }
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
    this.instrument.play(
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
  model.addTrack(0, new TrackData(synth, model.tempo));

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
  model.addTrack(0, new TrackData(drums, model.tempo));

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
  model.addTrack(1, new TrackData(synth, model.tempo));

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
