function CommandProcessor(model) {
    this.commandList = [];
    this.unsyncedCommands = [];
    this.buffer = [];
    this.model = model;
    this.inFlight = undefined;
    this.serverCommandCount = 0;

    this.inverses = [];   // For undo. TODO
}

CommandProcessor.prototype.fire = function(command) {
    this.commandList.push(command);
    this.buffer.push(command);
    this.unsyncedCommands.push(command);

    command.resolve(this.model);

    if (!this.inFlight) {
        this.sendCommand();
    }
};

CommandProcessor.prototype.handleCommandList = function(commands) {
    for (var command in commands) {
        if (command.sessionId != this.sessionId) {
            handleRemoteCommand(command);
        } else {
            this.inFlight = undefined;
        }
    }
}

CommandProcessor.prototype.handleRemoteCommand = function(command) {
    var bufferTransform = command;
    if (this.inFlight) {
        bufferTransform = this.inFlight.transform(command);
        this.inFlight = command.transform(this.inFlight);
    }
    for (var i = 0; i < buffer.length; i++) {
        buffer[i] = bufferTransform.transform(buffer[i]);
    }


    var cPrime = command;
    for (var i = 0; i < unsyncedCommands.length; i++) {
        cPrime = unsyncedCommands[i].transform(cPrime);
    }
    this.commandList.push(command);
    command.resolve(this.model);
}

CommandProcessor.prototype.sendCommand = function() {
    if (!this.inFlight) {
        var command = this.buffer[0];
        this.buffer = this.buffer.slice(1);
        this.unsyncedCommands = this.buffer.slice(1);

        // Firebase shit to send command over, with serverCommandCount
        FireBaseHandler.updateHistory(this.serverCommandCount, command);
        
        this.serverCommandCount += 1;

        this.inFlight = command;
    }
}

// Trigger this from Firebase
CommandProcessor.prototype.receiveCommands = function(data) {
    handleCommandList(data.commands);
    this.serverCommandCount = data.commandCount;

    if (!this.inFlight) {
        this.sendCommand();
    }
}
