const WebSocket = require('ws');

// Map to store active WebSocket connections for each pharmacy
const activeConnections = new Map();

// WebSocket Connection Handling
const onConnection = (ws, request) => {
    const pharmacyId = request.headers['x-pharmacy-id']; // Extract pharmacy ID from headers

    if (!pharmacyId) {
        ws.send(JSON.stringify({ error: 'Pharmacy ID is required' }));
        ws.close();
        return;
    }

    // Store active connection
    activeConnections.set(pharmacyId, ws);
    console.log(`Pharmacy ${pharmacyId} connected.`);

    // Heartbeat mechanism to detect dead connections
    ws.isAlive = true;
    ws.on('pong', () => (ws.isAlive = true));

    const interval = setInterval(() => {
        if (ws.isAlive === false) {
            activeConnections.delete(pharmacyId);
            ws.terminate();
            console.log(`Pharmacy ${pharmacyId} disconnected due to inactivity.`);
            return;
        }
        ws.isAlive = false;
        ws.ping();
    }, 30000);

    ws.on('close', () => {
        clearInterval(interval);
        activeConnections.delete(pharmacyId);
        console.log(`Pharmacy ${pharmacyId} disconnected.`);
    });
};

module.exports = {
    onConnection,
    activeConnections, // Exporting active connections
};
