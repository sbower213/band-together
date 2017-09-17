var commandTypes = {
    ADD_TRACK:7,
    MODIFY_TRACK:1,
    DELETE_TRACK:2,
    NOP:3,
    INSERT_NOTE:4,
    DELETE_NOTE:5,
    PROJECT_SETTINGS:6,
    ADD_SOUND: 8
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


