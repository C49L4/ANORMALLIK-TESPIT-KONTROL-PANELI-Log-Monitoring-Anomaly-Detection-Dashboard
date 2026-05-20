const express = require('express');
const store = require('../../database/store');

const router = express.Router();

// GET /api/logs — Fetch all logs (with optional limit)
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || store.logs.length;
    res.json(store.logs.slice(0, limit));
});

// GET /api/logs/stats — Get log statistics
router.get('/stats', (req, res) => {
    const recent = store.getRecentLogs(1);
    const actionCounts = {};
    recent.forEach(l => { actionCounts[l.action] = (actionCounts[l.action] || 0) + 1; });

    res.json({
        total_logs: store.logs.length,
        total_anomalies: store.anomalies.length,
        logs_last_minute: recent.length,
        unique_users: [...new Set(recent.map(l => l.user))].length,
        actions: actionCounts
    });
});

// POST /api/logs — Manually insert a log
router.post('/', (req, res) => {
    const log = req.body;

    if (!log.user || !log.action) {
        return res.status(400).json({ error: 'user and action fields are required' });
    }

    if (!log.id) log.id = Date.now().toString();
    if (!log.timestamp) log.timestamp = new Date().toISOString();
    if (!log.ip) log.ip = req.ip || '0.0.0.0';

    // Process through the anomaly engine (imported at runtime to avoid circular deps)
    const { processLog } = require('../anomaly/anomaly.engine');
    processLog(log);

    res.status(201).json({ message: 'Log processed', log });
});

module.exports = router;
