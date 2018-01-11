const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

// this will resolve \node-chat-app\server/../public to \node-chat-app\public
//console.log(__dirname + '../public');
//console.log(publicPath);
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users= new Users();

// configure middleware
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    var room;

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        // join the room
        socket.join(params.room);
        
        // add user
        users.removeUser(socket.id);        // remove the user from other room before
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // socket.emit from Admin text Welcome to the chat app
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        // socket.broadcast.emit from Admin text New user joined
        socket.to(params.room).broadcast.emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

        // success, not pass any err back
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        //console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
        }
        
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

