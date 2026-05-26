const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');

// Import modules
const authRoutes = require('./modules/auth/auth.routes');
const logRoutes = require('./modules/logs/logs.routes');
const anomalyRoutes = require('./modules/anomaly/anomaly.routes');
const demoRoutes = require('./modules/demo/demo.routes');
const { setIO } = require('./modules/anomaly/anomaly.engine');
const { setupWebSocket } = require('./websocket/socket');
const { startSimulator } = require('./simulator/generator');
const { apiLimiter } = require('./middleware/rateLimiter');
const store = require('./database/store');

// ==========================================
// APP SETUP
// ==========================================
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Give the anomaly engine access to socket.io
setIO(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// ==========================================
// ROUTES
// ==========================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        uptime: Math.floor(process.uptime()),
        logs: store.logs.length,
        anomalies: store.anomalies.length
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/anomalies', anomalyRoutes);
app.use('/api/demo', demoRoutes);

// ==========================================
// WEBSOCKET
// ==========================================
setupWebSocket(io);

// ==========================================
// START
// ==========================================
server.listen(config.PORT, () => {
    console.log(`\n🚀 Anomaly Detection Backend`);
    console.log(`   Server  → http://localhost:${config.PORT}`);
    console.log(`   Socket  → ws://localhost:${config.PORT}`);
    console.log(`\n📋 API Endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/logs`);
    console.log(`   GET  /api/logs/recent`);
    console.log(`   GET  /api/logs/aggregate`);
    console.log(`   GET  /api/logs/stats`);
    console.log(`   POST /api/logs`);
    console.log(`   GET  /api/anomalies`);
    console.log(`   GET  /api/anomalies/summary`);
    console.log(`   POST /api/demo/start`);
    console.log(`   POST /api/demo/stop`);
    console.log(`   POST /api/demo/trigger-attack`);
    console.log(`   POST /api/demo/reset`);
    console.log(`   GET  /api/demo/status\n`);

    // Auto-start the simulator
    startSimulator();
});
