const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

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

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        const createdAt = new Date().getTime();

        // socket.emit from Admin text Welcome to the chat app
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        // socket.broadcast.emit from Admin text New user joined
        socket.broadcast.emit('newMessage', generateMessage('Admin', `New user joined ${message.from}`));

        io.emit('newMessage', generateMessage(message.from, message.text));
    });

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

