var commandTypes = {
    ADD_TRACK:7,
    MODIFY_TRACK:1,
    DELETE_TRACK:2,
    NOP:3,
    INSERT_NOTE:4,
    MODIFY_NOTE:8,
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
    this.type = commandTypes.ADD_TRACK
    this.index = index;
    this.sessionId = sessionId;
}
AddTrack.prototype = Command.prototype;

AddTrack.prototype.resolve = function(model) {
    model.addTrack(index);
}
