var commandTypes = {
    ADD_TRACK:7,
    MODIFY_TRACK:1,
    DELETE_TRACK:2,
    NOP:3,
    INSERT_NOTE:4,
    DELETE_NOTE:5,
    PROJECT_SETTINGS:6
};


// ABSTRACT CLASS!
function Command() {
    this.type = undefined;
};

Command.prototype.transform = function(c2) {
    var transform = transformTable[this.type][c2.type];

    if (transform) {
        return transform(this, c2);
    }
    return c2;
}

Command.prototype.resolve = function(model) {
    // ABSTRACT METHOD!
}



function AddTrack(index, sessionId = globalSessionId) {
    this.type = commandTypes.ADD_TRACK;
    this.index = index;
    this.sessionId = sessionId;
}
AddTrack.prototype = Command.prototype;

AddTrack.prototype.resolve = function(model) {
    model.addTrack(this.index);
};


function ModifyTrack(index, trackData, sessionId = globalSessionId) {
    this.type = commandTypes.MODIFY_TRACK;
    this.index = index;
    this.trackData = trackData;
    this.sessionId = sessionId;
}
ModifyTrack.prototype = Command.prototype;

ModifyTrack.prototype.resolve = function(model) {
    model.modifyTrack(this.index, this.trackData);
};


function DeleteTrack(index, sessionId = globalSessionId) {
    this.type = commandTypes.DELETE_TRACK;
    this.index = index;
    this.sessionId = sessionId;
}
DeleteTrack.prototype = Command.prototype;

DeleteTrack.prototype.resolve = function(model) {
    model.deleteTrack(this.index);
};


function Nop(sessionId = globalSessionId) {
    this.sessionId = sessionId;
}
Nop.prototype = Command.prototype;


function InsertNote(track, beat, pitch, noteData, sessionId = globalSessionId) {
    this.track = track;
    this.beat = beat;
    this.pitch = pitch;
    this.noteData = noteData;
    this.sessionId = sessionId;
}
InsertNote.prototype = Command.prototype;

InsertNote.resolve = function(model) {
    model.addNote(this.track, this.beat, this.pitch, this.noteData);
};

function DeleteNote(track, beat, pitch, sessionId = globalSessionId) {
    this.track = track;
    this.beat = beat;
    this.pitch = pitch;
    this.sessionId = sessionId;
}
DeleteNote.prototype = Command.prototype;

DeleteNote.resolve = function(model) {
    model.deleteNote(this.track, this.beat, this.pitch);
};
