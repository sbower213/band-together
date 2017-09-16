//not working? make sure you ran npm install
var express = require('express');
var app = express();
var exphbs = require('express-handlebars'); //maybe use this to load existing tracks instead of jquery?
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

var http = require('http').Server(app);
var io = require('socket.io')(http);

var firebase = require('firebase');

//TODO: read from file;
var config = {
  apiKey: "apiKey",
  authDomain: "projectId.firebaseapp.com",
  databaseURL: "https://databaseName.firebaseio.com"
};

firebase.initializeApp(config);

var rootRef = firebase.database().ref();

var otServer = require('./otServer.js');
