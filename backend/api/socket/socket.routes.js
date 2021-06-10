function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('set-board', topic => {
            if (socket.boardTopic === topic) return;
            if (socket.boardTopic) {
                socket.leave(socket.boardTopic);
            }
            socket.join(topic);
            socket.boardTopic = topic;
        });
        socket.on('update-board', board => {
            socket.to(socket.boardTopic).broadcast.emit('board-update', board);
        })
        socket.on('set-card', topic => {
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            socket.myTopic = topic;
        });
        socket.on('update-card', card => {
            socket.to(socket.boardTopic).broadcast.emit('card-update', card);
        })
        socket.on('commenting', username => {
            socket.to(socket.myTopic).broadcast.emit('user-commenting', username);
        });
        socket.on('change-board', data => {
            io.emit('user-msg', data);
        });
    });
}

module.exports = connectSockets;