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
var historyID = window.location.hash.replace("#","");

function FireBaseHandler() {
}

var globalSessionId;
var audioCounter = 0;
FireBaseHandler.uploadAudio = function(buffer, callback) {
    var blob = new Blob(buffer.getChannelData[0]);

    if (!globalSessionId) {
        globalSessionId = 0;
    }
    
    var pointRef = storage.ref().child('' + globalSessionId + '_' + audioCounter);
    audioCounter++;

    pointRef.put(blob).then(callback);
                                       
}

FireBaseHandler.updateHistory = function(command_index,command) {
    history_entry = {};
    
    console.log(command);
    history_entry[command_index.toString()+"-"+command.sessionId.toString()] = command;
    
    database.ref("history/"+historyID).update(history_entry);

    
}

// Call Command Processor recieve commands function on change up of data
database.ref("history/"+historyID).on('child_added', function(data){
    console.log("child changed");
    console.log(data.val());
    var val = data.val();
    command_data = {}
    command_data.index = val.index;
    command_data.commands = Array.isArray(val) ? val : [val];
    commandProcessor.receiveCommands(command_data);
    
    //CommandProcessor.receiveCommands()
});
