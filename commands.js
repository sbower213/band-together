Command.prototype.resolve = function(model) {
    // ABSTRACT METHOD!
}

function nativizeCommand(command) {
    switch(command.type) {
    case commandTypes.ADD_TRACK:
        command.__proto__ = AddTrack.prototype;
        break;
    case commandTypes.MODIFY_TRACK:
        command.__proto__ = ModifyTrack.prototype;
        break;
    case commandTypes.DELETE_TRACK:
        command.__proto__ = DeleteTrack.prototype;
        break;
    case commandTypes.NOP:
        command.__proto__ = Nop.prototype;
        break;
    case commandTypes.INSERT_NOTE:
        command.__proto__ = InsertNote.prototype;
        break;
    case commandTypes.DELETE_NOTE:
        command.__proto__ = DeleteNote.prototype;
        break;
    case commandTypes.PROJECT_SETTINGS:
        command.__proto__ = ProjectSettings.prototype;
        break;
    case commandTypes.ADD_SOUND:
        command.__proto__ = AddSound.prototype;
        break;
    }
    return command;
}

function AddTrack(index, trackData, sessionId = globalSessionId) {
    this.type = commandTypes.ADD_TRACK;
    this.index = index;
    this.sessionId = sessionId;
    this.trackData = trackData;
}
AddTrack.prototype = Object.create(Command.prototype);

AddTrack.prototype.resolve = function(model) {
    model.addTrack(this.index, this.trackData);
};


function ModifyTrack(index, trackData, sessionId = globalSessionId) {
    this.type = commandTypes.MODIFY_TRACK;
    this.index = index;
    this.trackData = trackData;
    this.sessionId = sessionId;
}
ModifyTrack.prototype = Object.create(Command.prototype);

ModifyTrack.prototype.resolve = function(model) {
    model.modifyTrack(this.index, this.trackData);
};


function DeleteTrack(index, sessionId = globalSessionId) {
    this.type = commandTypes.DELETE_TRACK;
    this.index = index;
    this.sessionId = sessionId;
}
DeleteTrack.prototype = Object.create(Command.prototype);

DeleteTrack.prototype.resolve = function(model) {
    model.deleteTrack(this.index);
};


function Nop(sessionId = globalSessionId) {
    this.sessionId = sessionId;
}
Nop.prototype = Object.create(Command.prototype);


function InsertNote(track, beat, pitch, noteData, sessionId = globalSessionId) {
    this.type = commandTypes.INSERT_NOTE;
    this.track = track;
    this.beat = beat;
    this.pitch = pitch;
    this.noteData = noteData;
    this.sessionId = sessionId;
}
InsertNote.prototype = Object.create(Command.prototype);

InsertNote.prototype.resolve = function(model) {
    model.addNote(this.track, this.beat, this.noteData);
};

function DeleteNote(track, beat, pitch, sessionId = globalSessionId) {
    this.type = commandTypes.DELETE_NOTE;
    this.track = track;
    this.beat = beat;
    this.pitch = pitch;
    this.sessionId = sessionId;
}
DeleteNote.prototype = Object.create(Command.prototype);

DeleteNote.prototype.resolve = function(model) {
    model.deleteNote(this.track, this.beat, this.pitch);
};

function AddSound(index, bufferLength, sampleRate, downloadUrl, sessionId = globalSessionId) {
    this.index = index;
    this.bufferLength = bufferLength;
    this.sampleRate = sampleRate;
    this.downloadUrl = downloadUrl;
    this.sessionId = sessionId;
    this.type = commandTypes.ADD_SOUND;
}
AddSound.prototype = Object.create(Command.prototype);

AddSound.prototype.resolve = function(model) {
    soundBank[this.index] = {
        bufferLength: this.bufferLength,
        sampleRate: this.sampleRate,
        downloadUrl: this.downloadUrl
    };
}
