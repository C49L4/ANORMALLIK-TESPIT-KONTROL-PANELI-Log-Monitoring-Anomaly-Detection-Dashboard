const express = require('express');
const store = require('../../database/store');

const router = express.Router();

// GET /api/anomalies — Fetch all detected anomalies
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || store.anomalies.length;
    res.json(store.anomalies.slice(0, limit));
});

// GET /api/anomalies/summary — Anomaly breakdown
router.get('/summary', (req, res) => {
    const reasons = {};
    store.anomalies.forEach(a => {
        reasons[a.reason] = (reasons[a.reason] || 0) + 1;
    });

    res.json({
        total: store.anomalies.length,
        by_reason: reasons
    });
});

module.exports = router;
