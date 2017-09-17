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

    this.serverCommandCount++;

    if (!this.inFlight) {
        this.sendCommand();
    }
};

CommandProcessor.prototype.handleCommandList = function(commands) {
    for (var index in commands) {
        var command = commands[index];
        if (command.sessionId != this.sessionId) {
            this.handleRemoteCommand(nativizeCommand(command));
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
    for (var i = 0; i < this.buffer.length; i++) {
        this.buffer[i] = bufferTransform.transform(buffer[i]);
    }


    var cPrime = command;
    for (var i = 0; i < this.unsyncedCommands.length; i++) {
        cPrime = this.unsyncedCommands[i].transform(cPrime);
    }
    this.commandList.push(command);
    command.resolve(this.model);
    this.serverCommandCount++;
}

CommandProcessor.prototype.sendCommand = function() {
    if (!this.inFlight && this.buffer.length > 0) {
        var command = this.buffer[0];
        this.buffer = this.buffer.slice(1);
        this.unsyncedCommands = this.buffer.slice(1);
        // Firebase shit to send command over, with serverCommandCount
        FireBaseHandler.updateHistory(this.serverCommandCount, command);

        this.inFlight = command;
    }
}

// Trigger this from Firebase
CommandProcessor.prototype.receiveCommands = function(data) {
    console.log("received command!");
    console.log(data);
    this.handleCommandList(data.commands);

    if (!this.inFlight) {
        this.sendCommand();
    }
}
