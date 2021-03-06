
function Model() {
  this.beat = 0; // beats are 16th notes for now. so tempo / 4 is a beat.
  this.playInterval = null;
  this.tempo = 120.0; // bpm
  this.tracks = {};
  this.trackLength = 16; // steps

    this.recording = false;
    
  this.addNoteListeners = [];
  this.deleteNoteListeners = [];
  this.addTrackListeners = [];
  this.modifyTrackListeners = [];
  this.deleteTrackListeners = [];
    this.projectSettingsListeners = [];
    this.playheadListeners = [];
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

Model.prototype.registerDeleteTrackListener = function(fn) {
    this.deleteTrackListeners.push(fn);
}

Model.prototype.registerProjectSettingsListener = function(fn) {
    this.projectSettingsListeners.push(fn);
}

Model.prototype.registerPlayheadListener = function(fn) {
    this.playheadListeners.push(fn);
}

Model.prototype.addNote = function(track, beat, noteData) {
    this.tracks[track].addNote(beat, noteData);

    for (var i = 0; i < this.addNoteListeners.length; i++) {
        this.addNoteListeners[i](track, beat, noteData);
    }
};

Model.prototype.deleteNote = function(track, beat, pitch) {
    this.tracks[track].deleteNote(beat, pitch);

    for (var i = 0; i < this.deleteNoteListeners.length; i++) {
        this.deleteNoteListeners[i](track, beat, pitch);
    }
};

Model.prototype.addTrack = function(index, trackData) {
    this.tracks[index] = new Track(trackData, index);

  for (var i = 0; i < this.addTrackListeners.length; i++) {
      this.addTrackListeners[i](index, trackData);
  }
};

Model.prototype.modifyTrack = function(index, trackData) {
    this.tracks[index].trackData = trackData;
    if (trackData.instrument.name == 'synth') {
	this.tracks[index].instrument = new Synth('square', 'square');
    } else if (trackData.instrument.name == 'bass') {
        this.tracks[index].instrument = new BassSynth();
    } else if (trackData.instrument.name == 'drums') {
	this.tracks[index].instrument = new Drums();
    } else if (trackData.instrument.name == 'microphone') {
	this.tracks[index].instrument = new Microphone(index);
    }
    
    for (var i = 0; i < this.modifyTrackListeners.length; i++) {
        this.modifyTrackListeners[i](index, trackData);
    }
};

Model.prototype.deleteTrack = function(index) {
    delete this.tracks[index];
    
    for (var i = 0; i < this.deleteTrackListeners.length; i++) {
        this.deleteTrackListeners[i](index);
    }
};

Model.prototype.projectSettings = function(settings) {
    for (var i = 0; i < this.projectSettingsListeners.length; i++) {
        this.projectSettingsListeners[i](settings);
    }
};

Model.prototype.isPlaying = function() {
  return this.playinterval != null;
}

Model.prototype.pause = function() {
  if (this.playInterval) {
    clearInterval(this.playInterval);
      this.playInterval = null;
      document.getElementById("bgvideo").pause();
  }
};

Model.prototype.play = function() {
  if (this.playInterval) {
    return;
  }
  document.getElementById("bgvideo").play();
  // TODO: probably not a good way to do this. Should keep time using current
  // time to minimize time drift
  this.playInterval = setInterval(
    function() {
      const keys = Object.keys(this.tracks);
      for (let i = 0; i < keys.length; i++) {
	this.tracks[keys[i]].play(this.beat);
      }
        this.beat = (this.beat + 1) % this.trackLength;
        this.beatTime = new Date().getTime();

        for (var i = 0; i < this.playheadListeners.length; i++) {
            this.playheadListeners[i](this.beat);
        }
    }.bind(this),
    1.0 / this.tempo / 4.0 * 60.0 * 1000.0,
  );
};

Model.prototype.floatBeat = function() {
    if (!this.playInterval)
        return this.beat;
    var frac = (new Date().getTime()) - this.beatTime;
    frac *= this.tempo;
    return this.beat + frac;
}

Model.prototype.record = function() {
    this.recording = !this.recording;
}

Model.prototype.stop = function() {
  this.pause();
  this.beat = 0;
};



function Track(trackData, index) {
    this.index = index;
    this.trackData = trackData;
    this.notes = [];
    if (this.trackData.instrument.name == "synth") {
        this.instrument = new Synth('square', 'square');
        this.instrument.offset = this.trackData.instrument.offset;
        this.instrument.mix = this.trackData.instrument.mix;
    } else if (this.trackData.instrument.name == "drums") {
        this.instrument = new Drums();
    } else if (this.trackData.instrument.name == "microphone") {
 
        this.instrument = new Microphone();
    }
};

Track.prototype.addNote = function(beat, notedata) {
    var n = new Note(notedata);
    if (!this.notes[beat]) {
        this.notes[beat] = [];
    }
    this.notes[beat].push(n);

    if (this.trackData.instrument.name == "microphone") {
        this.instrument.load(n.noteData.soundIndex);
    }
};

Track.prototype.deleteNote = function(beat, pitch) {
    if (!this.notes[beat]) {
        return;
    }
    for (var i = 0; i < this.notes[beat].length; i++) {
        if (this.notes[beat][i].noteData.pitch == pitch) {
            this.notes[beat].splice(i, 1);
            return;
        }
    }
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

Track.prototype.playNote = function(midi, duration) {
    this.instrument.play(midi, duration);

    if (model.recording) {
        commandProcessor.fire(new InsertNote(this.index, model.beat, midi,
                                             { pitch: midi,
                                               duration: duration * this.trackData.tempo * 4.0 / 60.0 }));
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
  model.addTrack(0, new TrackData({
    name: 'synth',
    offset: 1200,
    mix: 0.5,
  }, model.tempo));

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
  model.addTrack(0, new TrackData({name: 'drums'}, model.tempo));

  // kick
  model.addNote(0, 0, new NoteData(60, 1));
  model.addNote(0, 4, new NoteData(60, 1));
  model.addNote(0, 8, new NoteData(60, 1));
  model.addNote(0, 12, new NoteData(60, 1));

  // clap
  model.addNote(0, 4, new NoteData(61, 1));
  model.addNote(0, 12, new NoteData(61, 1));

  // hi hat
  model.addNote(0, 0, new NoteData(63, 1));
  model.addNote(0, 2, new NoteData(63, 1));
  model.addNote(0, 4, new NoteData(63, 1));
  model.addNote(0, 6, new NoteData(63, 1));
  model.addNote(0, 8, new NoteData(63, 1));
  model.addNote(0, 10, new NoteData(63, 1));
  model.addNote(0, 12, new NoteData(63, 1));
  model.addNote(0, 14, new NoteData(63, 1));

  model.play();
}

function testMicrophone() {
  let model = new Model();
  model.addTrack(2, new TrackData({name: 'microphone'}, model.tempo));
  model.addNote(2, 0, new NoteData(0, 16));

  const mic = model.tracks[2].instrument;
  
  setTimeout(function() {
    mic.startRecord();
    setTimeout(function() {
      mic.stopRecord();
      model.play();
    }, 1000);
  }, 2000);
}
