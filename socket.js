module.exports = function(io) {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.user_id;
        if (userId) {
            socket.join(userId); // Join personal room
            console.log(` User ${userId} connected with socket ID: ${socket.id}`);
        }

        // Handle chat message broadcast to specific receiver
        socket.on('chat-message', (data) => {
            const { receiver_id, message } = data;
            io.to(receiver_id.toString()).emit('chat-message', { message, sender_id: userId });
            console.log(`Message sent to ${receiver_id}`);
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
            console.log(`User ${userId} disconnected`);
        });
    });
};

// these file have all event as front can use it to emit real-time data without saving it in database
