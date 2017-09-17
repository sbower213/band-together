var config = {
    apiKey: "AIzaSyDvL0NgPpVf4xfhd6dfNFy2qZSGekCEgSg",
    authDomain: "band-together-hackmit.firebaseapp.com",
    databaseURL: "https://band-together-hackmit.firebaseio.com",
    projectId: "band-together-hackmit",
    storageBucket: "band-together-hackmit.appspot.com",
    messagingSenderId: "711340754671"
};

firebase.initializeApp(config);
var provider = new firebase.auth.GoogleAuthProvider();
var database = firebase.database();
var storage = firebase.storage();
var historyID = "hack";

function FireBaseHandler() {
}

FireBaseHandler.updateHistory = function(command_index,command) {
    history_entry = {};
    
    console.log(command);
    history_entry[command_index.toString()+"-"+command.sessionId.toString()] = command;
    
    database.ref("history/"+historyID).update(history_entry);

    
}

// Call Command Processor recieve commands function on change up of data
database.ref("history/"+historyID).on('child_changed', function(data){
    command_data = {}
    command_data.serverCommandCount = data.numChildren();
    command_data.commands = []
    data.forEach(function(elt){
        command_data.commands.push(elt);
    })
    CommandProcessor.receiveCommands(command_data);
    
    //CommandProcessor.receiveCommands()
});