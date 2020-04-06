const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const Room = require('./model/Room');
const User = require('./model/User');
const Message = require('./model/Message');

server.listen(3001);

app.get('/', (request, respons) => {
    respons.sendFile(__dirname + 'index.html');
});

let connections = [];
let rooms = [];

let massages = [];

io.sockets.on('connection', (socket) => {
    connections.push(socket);

    socket.on('new user', (username, newRoomMod, roomId) => {
        socket.username = username;

        const user = new User(username);
        let room;
        let localRoomId;
        if (newRoomMod) {
            room = new Room();
            localRoomId = room.getRoomId();
            rooms[localRoomId] = room;
        } else {
            localRoomId = roomId;
            room = rooms[localRoomId];
        }
        user.setRoomId(localRoomId);
        room.addUser(user);

        socket.join(localRoomId);

        socket.broadcast.to(localRoomId).emit('user join', {
            allUsers: room.getCurrentUsers()
        });
        socket.emit('registred', {
            roomId: localRoomId,
            userData: {
                userId: user.getUserId(),
                name: user.getName()
            },
            allMessages: room.getMessages(),
            allUsers: room.getCurrentUsers()
        })
    });

    socket.on('new message', data => {

        let room = rooms[data.roomId];
        const user = room.getUserById(data.userId);
        const message = new Message(user, data.roomId, data.messageText);

        room.addMessage(message);

        massages.push(data);
        io.sockets.to(data.roomId).emit('new message', {
            message: data.messageText,
            userData: {
                userId: user.getUserId(),
                name: user.getName()
            }
        })
    });

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
    });


});



