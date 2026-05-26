const store = require('../database/store');

function setupWebSocket(io) {
    let connectedClients = 0;

    io.on('connection', (socket) => {
        connectedClients++;
        console.log(`🟢 Client connected (${connectedClients} total)`);

        // Send existing data to new client
        socket.emit('INITIAL_LOGS', store.logs.slice(0, 50));
        socket.emit('INITIAL_ANOMALIES', store.anomalies.slice(0, 20));

        socket.on('disconnect', () => {
            connectedClients--;
            console.log(`🔴 Client disconnected (${connectedClients} remaining)`);
        });
    });

    return { getClientCount: () => connectedClients };
}

module.exports = { setupWebSocket };
