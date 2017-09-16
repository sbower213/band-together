



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

var transformTable = {}

for (var key in commandTypes.keys()) {
    transformTable[commandTypes[key]] = {};
}



// ABSTRACT CLASS!
function Command() {
    this.type = undefined;
};

Command.prototype.transform = function(c2) {
    return transformTable[this.type][c2.type](this, c2);
}

Command.prototype.resolve = function(model) {
    // ABSTRACT METHOD!
}



function AddTrack(offset) {
    this.type = commandTypes.ADD_TRACK
    this.offset = offset;
}
AddTrack.prototype = Command.prototype;

AddTrack.prototype.resolve = function(model) {

}
