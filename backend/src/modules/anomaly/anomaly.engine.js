const store = require('../../database/store');

// Track activity per user for frequency analysis
const userActivity = {};

// The socket.io instance — set from server.js
let io = null;

function setIO(socketIO) {
    io = socketIO;
}

// ==========================================
// ANOMALY RULES
// ==========================================

function analyzeLog(log) {
    const now = Date.now();
    const userId = log.user;

    // Initialize tracking
    if (!userActivity[userId]) {
        userActivity[userId] = { timestamps: [], failedLoginTimes: [] };
    }

    const activity = userActivity[userId];
    activity.timestamps.push(now);
    activity.timestamps = activity.timestamps.filter(t => now - t < 60000);

    if (log.action === 'FAILED_LOGIN') {
        activity.failedLoginTimes.push(now);
    }
    activity.failedLoginTimes = activity.failedLoginTimes.filter(t => now - t < 60000);

    if (log.action === 'LOGIN') {
        activity.failedLoginTimes = [];
    }

    // RULE 1: High request frequency (>20 per minute)
    if (activity.timestamps.length > 20) {
        return { is_anomaly: true, reason: 'High request frequency', risk_score: 75 };
    }

    // RULE 2: Multiple failed logins within the last minute
    if (log.action === 'FAILED_LOGIN' && activity.failedLoginTimes.length > 3) {
        return { is_anomaly: true, reason: 'Multiple failed logins', risk_score: 85 };
    }

    // RULE 3: Sensitive actions are scored, but not all are anomalous on first use
    const sensitiveHigh = ['DELETE_RECORD', 'ACCESS_ADMIN'];
    if (sensitiveHigh.includes(log.action)) {
        return { is_anomaly: false, reason: null, risk_score: 60 };
    }

    if (log.action === 'EXPORT_DATA') {
        return { is_anomaly: false, reason: null, risk_score: 50 };
    }

    return { is_anomaly: false, reason: null, risk_score: log.risk_score || 0 };
}

// ==========================================
// CENTRAL LOG PROCESSOR
// ==========================================

function processLog(log) {
    const result = analyzeLog(log);
    log.risk_score = result.risk_score;

    // Save to store
    store.addLog(log);

    // Broadcast to frontends
    if (io) io.emit('NEW_LOG', log);

    // Handle anomaly
    if (result.is_anomaly) {
        const anomaly = {
            id: `anomaly_${Date.now()}`,
            log_id: log.id,
            user: log.user,
            action: log.action,
            ip: log.ip,
            reason: result.reason,
            risk_score: result.risk_score,
            timestamp: log.timestamp
        };

        store.addAnomaly(anomaly);
        if (io) io.emit('NEW_ANOMALY', anomaly);
        console.log(`🚨 ANOMALY: ${result.reason} → ${log.user}`);
    }
}

// Reset tracking (used by demo controls)
function resetEngine() {
    Object.keys(userActivity).forEach(k => delete userActivity[k]);
}

module.exports = { processLog, analyzeLog, resetEngine, setIO };
