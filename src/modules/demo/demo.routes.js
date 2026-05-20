const express = require('express');
const store = require('../../database/store');
const { processLog, resetEngine } = require('../anomaly/anomaly.engine');
const { startSimulator, stopSimulator, isRunning } = require('../../simulator/generator');

const router = express.Router();

// POST /api/demo/start — Start the fake data simulator
router.post('/start', (req, res) => {
    if (isRunning()) {
        return res.json({ message: 'Simulator already running' });
    }
    startSimulator();
    res.json({ message: 'Simulator started' });
});

// POST /api/demo/stop — Stop the simulator
router.post('/stop', (req, res) => {
    stopSimulator();
    res.json({ message: 'Simulator stopped' });
});

// POST /api/demo/trigger-attack — Simulate a burst attack (great for presentations)
router.post('/trigger-attack', (req, res) => {
    const attacker = 'attacker_x';
    const count = 15;

    for (let i = 0; i < count; i++) {
        const log = {
            id: `attack_${Date.now()}_${i}`,
            user: attacker,
            action: ['FAILED_LOGIN', 'ACCESS_ADMIN', 'DELETE_RECORD'][i % 3],
            ip: '10.0.0.99',
            device: 'Unknown',
            session_id: 'hijacked_session',
            risk_score: 0,
            timestamp: new Date().toISOString()
        };
        processLog(log);
    }

    res.json({ message: `Simulated attack: ${count} suspicious logs from ${attacker}` });
});

// POST /api/demo/reset — Clear all data and reset the engine
router.post('/reset', (req, res) => {
    store.clearAll();
    resetEngine();
    res.json({ message: 'All data cleared' });
});

// GET /api/demo/status — Check simulator status
router.get('/status', (req, res) => {
    res.json({ simulator_running: isRunning(), logs: store.logs.length, anomalies: store.anomalies.length });
});

module.exports = router;
