const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const supabase = require('./config/dbconfig'); // Supabase client setup
const cors = require('cors');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Active WebSocket connections map
const activeConnections = new Map();

/**
 * Handle WebSocket connections
 */const onConnection = (ws, request) => {
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
        } else {
            ws.isAlive = false;
            ws.ping();
        }
    }, 30000);

    ws.on('close', () => {
        clearInterval(interval);
        activeConnections.delete(pharmacyId);
        console.log(`Pharmacy ${pharmacyId} disconnected.`);
    });

    ws.on('error', (err) => {
        console.error(`Error on Pharmacy ${pharmacyId} connection: ${err.message}`);
    });

    console.log(`Current active connections: ${Array.from(activeConnections.keys())}`);
};

// Attach WebSocket connection handling
wss.on('connection', onConnection);

/**
 * Subscribe to Supabase notifications
 */
const subscribeToNotifications = () => {
    try {
        supabase
            .channel('notification-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notification' },
                (payload) => {
                    const { pharmacy_id, notification_msg } = payload.new;

                    console.log(`Notification received for Pharmacy ${pharmacy_id}`);

                    if (pharmacy_id) {
                        // Notify specific pharmacy
                        const ws = activeConnections.get(pharmacy_id);
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ message: notification_msg }));
                            console.log(`Notification sent to Pharmacy ${pharmacy_id}`);
                        } else {
                            console.log(`Pharmacy ${pharmacy_id} is not connected.`);
                        }
                    } else {
                        // Broadcast to all connected pharmacies
                        activeConnections.forEach((ws, id) => {
                            if (ws.readyState === WebSocket.OPEN) {
                                ws.send(JSON.stringify({ message: notification_msg }));
                                console.log(`Broadcasted notification to Pharmacy ${id}`);
                            }
                        });
                    }
                }
            )
            .subscribe();
    } catch (error) {
        console.error('Error subscribing to notifications:', error.message);
    }
};

// Start Supabase real-time notifications
subscribeToNotifications();
/**
 * Subscribe to Supabase notifications
 */

/**
 * Middleware setup
 */
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

/**
 * Routes
 */
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));
app.use('/api/medicine', require('./routes/medicineRoutes'));
app.use('/api/password', require('./routes/passwordRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/order', require('./routes/orderRoutes'));
app.use('/api/notification', require('./routes/notificationRoutes'));
app.use('/api/search-medicine', require('./routes/search'));
app.use('/api/pharmacy', require('./routes/pharmacyRoutes'));
app.use('/api/admin', require('./admin/router/adminRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

/**
 * Handle WebSocket upgrade requests
 */
server.on('upgrade', (request, socket, head) => {
    try {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } catch (error) {
        console.error('WebSocket upgrade failed:', error.message);
        socket.destroy();
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('API server is running.');
});
app.post('/api/set-token', async (req, res) => {
    try {
      // Extract token from localStorage
      const token = req.body.token;
      if (!token) {
        return res.status(400).json({ message: 'Token not found' });
      }
  
      // Set token in another localStorage (host:3001)
      const targetUrl = 'http://localhost:3001';
      const newToken = jwtDecode(token).newToken; // Extract new token (optional)
  
      if (newToken) {
        await axios.post(`${targetUrl}/api/save-token`, { token: newToken });
      } else {
        await axios.post(`${targetUrl}/api/save-token`, { token });
      }
  
      res.status(200).json({ message: 'Token set successfully in localStorage' });
    } catch (error) {
      console.error('Error setting token:', error.message);
      res.status(500).json({ message: 'Failed to set token' });
    }
  });
/**
 * Start the server
 */
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
