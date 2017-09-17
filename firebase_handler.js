var config = {
    apiKey: "AIzaSyDvL0NgPpVf4xfhd6dfNFy2qZSGekCEgSg",
    authDomain: "band-together-hackmit.firebaseapp.com",
    databaseURL: "https://band-together-hackmit.firebaseio.com",
    projectId: "band-together-hackmit",
    storageBucket: "band-together-hackmit.appspot.com",
    messagingSenderId: "711340754671"
};

var provider = new firebase.auth.GoogleAuthProvider();
var database = firebase.database();
var storage = firebase.storage();
var historyID = "hack"

function FireBaseHandler() {
}

FireBaseHandler.updateHistory = function(command_index,command) {
    database.ref("history/"+historyID).set({
        command_index:command
    });
    
}