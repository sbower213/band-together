var transformTable = {}

for (var key in commandTypes.keys()) {
    transformTable[commandTypes[key]] = {};
}

transformTable[commandTypes.ADD_TRACK][commandTypes.ADD_TRACK] =
    function(c1, c2) {
        if (c1.index < c2.index ||
            c1.index == c2.index && c1.sessionIndex < c2.sessionIndex) {
            return new AddTrack(c2.index + 1, c2.sessionIndex);
        }
        return c2;
    };
transformTable[commandTypes.ADD_TRACK][commandTypes.MODIFY_TRACK] =
    function(c1, c2) {
        if (c1.index <= c2.index) {
            return new ModifyTrack(c2.index + 1, c2.trackData, c2.sessionIndex);
        }
        return c2;
    };
transformTable[commandTypes.ADD_TRACK][commandTypes.DELETE_TRACK] =
    function(c1, c2) {
        if (c1.index <= c2.index) {
            return new DeleteTrack(c2.index + 1, c2.sessionIndex);
        }
        return c2;
    };
transformTable[commandTypes.ADD_TRACK][commandTypes.INSERT_NOTE] =
    function(c1, c2) {
        if (c1.index <= c2.index) {
            return new InsertNote(c2.index + 1, c2.beat, c2.pitch, c2.noteData, c2.sessionIndex);
        }
        return c2;
    };
transformTable[commandTypes.ADD_TRACK][commandTypes.DELETE_NOTE] =
    function(c1, c2) {
        if (c1.index <= c2.index) {
            return new DeleteNote(c2.index + 1, c2.beat, c2.pitch, c2.sessionIndex);
        }
    };



transformTable[commandTypes.DELETE_TRACK][commandTypes.ADD_TRACK] =
    function(c1, c2) {
        if (c1.index < c2.index) {
            return new AddTrack(c2.index - 1, c2.sessionIndex);
        }
        return c2;
    };
transformTable[commandTypes.DELETE_TRACK][commandTypes.MODIFY_TRACK] =
    function(c1, c2) {
        if (c1.index < c2.index) {
            return new DeleteTrack(c2.index - 1, c2.sessionIndex);
        }
        return c2;
    };
transformTable[commandTypes.DELETE_TRACK][commandTypes.DELETE_TRACK] =
    function(c1, c2) {
        if (c1.index < c2.index) {
            return new DeleteTrack(c2.index - 1, c2.sessionIndex);
        }
        if (c1.index == c2.index) {
            return new Nop(c2.sessionIndex);
        }
        return c2;
    };
transformTable[commandTypes.DELETE_TRACK][commandTypes.INSERT_NOTE] =
    function(c1, c2) {
        if (c1.index < c2.index) {
            return new InsertNote(c2.index - 1, c2.beat, c2.pitch, c2.noteData, c2.sessionIndex);
        }
        if (c1.index == c2.index) {
            return new Nop(c2.sessionIndex);
        }
        return c2;
    };
transformTable[commandTypes.DELETE_TRACK][commandTypes.DELETE_NOTE] =
    function(c1, c2) {
        if (c1.index < c2.index) {
            return new DeleteNote(c2.index - 1, c2.beat, c2.pitch, c2.sessionIndex);
        }
        if (c1.index == c2.index) {
            return new Nop(c2.sessionIndex);
        }
        return c2;
    };


transformTable[commandTypes.INSERT_NOTE][commandTypes.INSERT_NOTE] =
    function(c1, c2) {
        if (c1.index == c2.index && c1.beat == c2.beat && c1.pitch == c2.pitch &&
           c1.sessionIndex < c2.sessionIndex) {
            return new Nop(c2.sessionIndex);
        }
        return c2;
    };
transformTable[commandTypes.INSERT_NOTE][commandTypes.DELETE_NOTE] =
    function(c1, c2) {
        if (c1.index == c2.index && c1.beat == c2.beat && c1.pitch == c2.pitch) {
            return new Nop(c2.sessionIndex);
        }
        return c2;
    };
