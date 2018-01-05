const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// this will resolve \node-chat-app\server/../public to \node-chat-app\public
const publicPath = path.join(__dirname, '../public');
//console.log(__dirname + '../public');
//console.log(publicPath);

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// configure middleware
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

// io.on('disconnect', (socket) => {
//     console.log('New user connected');
// });

server.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

