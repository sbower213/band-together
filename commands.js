Command.prototype.resolve = function(model) {
    // ABSTRACT METHOD!
}

function nativizeCommand(command) {
    switch(command.type) {
    case 7:
        command.__proto__ = AddTrack.prototype;
        break;
    case 1:
        command.__proto__ = ModifyTrack.prototype;
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
    this.track = track;
    this.beat = beat;
    this.pitch = pitch;
    this.noteData = noteData;
    this.sessionId = sessionId;
}
InsertNote.prototype = Object.create(Command.prototype);

InsertNote.resolve = function(model) {
    model.addNote(this.track, this.beat, this.pitch, this.noteData);
};

function DeleteNote(track, beat, pitch, sessionId = globalSessionId) {
    this.track = track;
    this.beat = beat;
    this.pitch = pitch;
    this.sessionId = sessionId;
}
DeleteNote.prototype = Object.create(Command.prototype);

DeleteNote.resolve = function(model) {
    model.deleteNote(this.track, this.beat, this.pitch);
};
