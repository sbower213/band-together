

function CommandProcessor(model) {
    this.commandList = [];
    this.unsyncedCommands = [];
    this.buffer = [];
    this.model = model;
    this.inFlight = undefined;

    this.inverses = [];   // For undo. TODO
}

CommandProcessor.fire = function(command) {
    this.commandList.append(command);
    this.buffer.append(command);
    this.unsyncedCommands.append(command);

    command.resolve(this.model);

    if (!this.inFlight) {
        sendCommand();
    }
};

CommandProcessor.handleCommandList = function(commands) {
    for (var command in commands) {
        if (command.sessionId != this.sessionId) {
            handleRemoteCommand(command);
        } else {
            this.inFlight = undefined;
        }
    }
}

CommandProcessor.handleRemoteCommand = function(command) {
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
    this.commandList.append(command);
    command.resolve(this.model);
}

CommandProcessor.sendCommand() {
    if (!this.inFlight) {
        var command = this.buffer[0];
        this.buffer = this.buffer.slice(1);
        this.unsyncedCommands = this.buffer.slice(1);
    
        // Firebase shit to send command over

        this.inFlight = command;
    }
}

// Trigger this from Firebase
CommandProcessor.receiveCommands = function(data) {
    handleCommandList(data.commands);
    
    if (!this.inFlight) {
        this.sendCommand();
    }
}
