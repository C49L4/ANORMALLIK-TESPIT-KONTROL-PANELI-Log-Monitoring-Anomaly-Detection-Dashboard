const express = require('express');
const store = require('../../database/store');

const router = express.Router();

// GET /api/logs — Fetch paginated logs with optional filtering
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const search = req.query.search;
    const severity = req.query.severity;
    const start = req.query.start;
    const end = req.query.end;

    const result = store.queryLogs({ page, pageSize, search, severity, start, end });
    res.json(result);
});

// GET /api/logs/recent — Fetch latest logs for charts or recent views
router.get('/recent', (req, res) => {
    const limit = parseInt(req.query.limit) || 1000;
    res.json(store.getLatestLogs(limit));
});

// GET /api/logs/aggregate — Return buckets for chart aggregation
router.get('/aggregate', (req, res) => {
    const interval = req.query.interval || 'hour';
    const limit = parseInt(req.query.limit) || 1000;
    res.json(store.aggregateLogs(interval, limit));
});

// GET /api/logs/stats — Get log statistics
router.get('/stats', (req, res) => {
    res.json(store.getStats());
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
