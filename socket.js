const onlineUsers = new Map();
module.exports = function(io) {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.user_id;
        if (userId) {
            socket.join(userId); // Join personal room
            onlineUsers.set(userId, socket.id);
            console.log(` User ${userId} connected with socket ID: ${socket.id}`);
            socket.broadcast.emit('user-online', { user_id: userId });
        }

        // get online users
        socket.on('get-online-users', () => {
            socket.emit('online-users', Array.from(onlineUsers.keys()));
        });

        // Typing status (for a specific receiver)
        socket.on('typing', ({ receiver_id }) => {
            io.to(receiver_id.toString()).emit('show_typing_status', { sender_id: userId });
            console.log(`User ${userId} is typing...`);
        });

        socket.on('stop_typing', ({ receiver_id }) => {
            io.to(receiver_id.toString()).emit('stop_typing', { sender_id: userId });
            console.log(`User ${userId} stopped typing`);
        });

        socket.on('disconnect', () => {
            onlineUsers.delete(userId);
            console.log(`User ${userId} disconnected`);
            socket.broadcast.emit('user-offline', { user_id: userId });
        });
    });

};


