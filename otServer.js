function ServerCommandProcessor() {
    this.commandList = [];
    this.unsentCommands = [];
}


ServerCommandProcessor.receiveCommand(command, commandCount) {
    for (var i = this.commandCount + 1; i < this.commandList.length; i++) {
        command = this.commandList[i].transform(command);
    }

    this.commandList.append(command);
    this.unsentCommands.append(command);
}

ServerCommandProcessor.sendCommands() {
    //Broadcast unsentCommands and commandList.length

    this.unsentCommands = [];
}
