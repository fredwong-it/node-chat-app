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

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        const createdAt = new Date().getTime();

        // socket.emit from Admin text Welcome to the chat app
        socket.emit('newMessage', {
            from: 'Admin',
            text: 'Welcome to the chat app',
            createdAt
        });

        // socket.broadcast.emit from Admin text New user joined
        socket.broadcast.emit('newMessage', {
            from: 'Admin',
            text: `New user joined ${message.from}`,
            createdAt
        });

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt
        });
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
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

