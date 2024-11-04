const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir arquivos estáticos
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


let rooms = {};

io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    socket.on('create-room', () => {
        const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
        rooms[roomCode] = { players: [] };
        socket.join(roomCode);
        io.to(socket.id).emit('room-created', roomCode);
    });

    socket.on('join-room', (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            io.to(roomCode).emit('player-joined', rooms[roomCode].players.length);
        } else {
            io.to(socket.id).emit('error', 'Sala cheia ou inexistente.');
        }
    });

    socket.on('make-move', (data) => {
        const { roomCode, index, player } = data;
        socket.to(roomCode).emit('move-made', { index, player });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        // Lógica para limpar salas vazias
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
