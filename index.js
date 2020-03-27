/*const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const database = require('./app/config/dbconfig');
const port = process.argv[2] || 3000;

const http = require('http');
const io = require('socket.io')(http);
var cors = require('cors');
app.use(cors());
process.on('exit', function (code) {
    return console.log(`About to exit with code ${code}`);
});

var serveur = http.createServer(app);

io.on('connection', function(socket){
    console.log('a user connected');
});
database
    .init
    .then((db) => {
        console.log('aaa');
        serveur.listen(3000);

        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());

        // Router configuration 
        const REST_API_ROOT = '/api';
        app.use(REST_API_ROOT, require('./app/routes/router'));

        //accès aux pages statiques
        app.use('/static', express.static('static'));

    });

*/


var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const database = require('./app/config/dbconfig');
var server = http.createServer(app);
var messages = [];
var cors = require('cors');
app.use(cors());
var port = 3000;
var io = require('socket.io').listen(server);
var messageRooms = [];
io.sockets.on('connection', function (socket) {
    console.log('user connecté');
    socket.emit('init',messages);
    socket.on('envoieDescription',data=>{ // data = [nomBiere, description]
        messages.push(data)
        socket.broadcast.emit('broad', data);
    });
    socket.on('createRoom',room=>{
        if(messageRooms[room] == null){
            messageRooms[room] = []
        }else{
            socket.emit('initialisation',messageRooms[room]);
        }
        socket.join(room);
        console.log(room+' a été rejoint');

    });
    socket.on('sendMessage',function(data){ // data = [room , message]
        messageRooms[data[0]].push(data[1])
        socket.broadcast.to(data[0]).emit('messageBroad',data);
    })

});

database
    .init
    .then((db) => {
        console.log('aaa');
        server.listen(port, function () {
            console.log("Server listening on port : " + port);
        });

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        // Router configuration 
        const REST_API_ROOT = '/api';
        app.use(REST_API_ROOT, require('./app/routes/router'));

        //accès aux pages statiques
        app.use('/static', express.static(__dirname + '/client'));
    });



