const config = require('../config');
const { processLog } = require('../modules/anomaly/anomaly.engine');

const users = ['user_01', 'user_02', 'user_03', 'user_04', 'user_admin'];
const actions = ['VIEW_REPORT', 'LOGIN', 'DOWNLOAD_DATA', 'FAILED_LOGIN', 'EDIT_SETTINGS', 'DELETE_RECORD', 'EXPORT_DATA', 'ACCESS_ADMIN'];
const devices = ['Chrome', 'Firefox', 'Safari', 'Edge'];

let intervalId = null;

function generateFakeLog() {
    const log = {
        id: Date.now().toString(),
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        ip: `192.168.1.${Math.floor(Math.random() * 50)}`,
        device: devices[Math.floor(Math.random() * devices.length)],
        session_id: `sess_${Math.random().toString(36).substring(2, 10)}`,
        risk_score: Math.floor(Math.random() * 20),
        timestamp: new Date().toISOString()
    };

    processLog(log);
}

function startSimulator() {
    if (intervalId) return;
    intervalId = setInterval(generateFakeLog, config.SIMULATOR_INTERVAL);
    console.log(`📡 Simulator started (every ${config.SIMULATOR_INTERVAL}ms)`);
}

function stopSimulator() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('⏹️  Simulator stopped');
    }
}

function isRunning() {
    return intervalId !== null;
}

module.exports = { startSimulator, stopSimulator, isRunning };
