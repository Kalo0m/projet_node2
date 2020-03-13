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
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var list = [];
const database = require('./app/config/dbconfig');
var server = http.createServer(app);
var messagesServeur = [];
var messagesClient = [];
var cors = require('cors');
app.use(cors());

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log('user connecté');
    socket.emit('init',[messagesClient,messagesServeur]);
    socket.on('envoieDescription',data=>{ // data = [nomBiere, nomPays]
        messagesClient.push(data[0]);
        messagesServeur.push(data[1]);
        socket.broadcast.emit('broad', data);
        console.log(data);  
    })
});

database
    .init
    .then((db) => {
        console.log('aaa');
        server.listen(3000);

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        // Router configuration 
        const REST_API_ROOT = '/api';
        app.use(REST_API_ROOT, require('./app/routes/router'));

        //accès aux pages statiques
        app.use('/static', express.static(__dirname + '/client'));
    });



