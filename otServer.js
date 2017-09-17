function ServerCommandProcessor() {
    this.commandList = [];
    this.unsentCommands = [];
}

ServerCommandProcessor.prototype.receiveCommand(command, commandCount) {
    for (var i = this.commandCount + 1; i < this.commandList.length; i++) {
        command = this.commandList[i].transform(command);
    }

    this.commandList.append(command);
    this.unsentCommands.append(command);
    
    this.sendCommands();
}

ServerCommandProcessor.prototype.sendCommands() {
    //Broadcast unsentCommands and commandList.length
    
    this.unsentCommands = [];
}
