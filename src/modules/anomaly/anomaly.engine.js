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
        userActivity[userId] = { timestamps: [], failedLogins: 0 };
    }

    const activity = userActivity[userId];
    activity.timestamps.push(now);

    // Keep only last 60 seconds
    activity.timestamps = activity.timestamps.filter(t => now - t < 60000);

    // Track failed logins
    if (log.action === 'FAILED_LOGIN') activity.failedLogins++;

    // RULE 1: High request frequency (>10 per minute)
    if (activity.timestamps.length > 10) {
        return { is_anomaly: true, reason: 'High request frequency', risk_score: 75 };
    }

    // RULE 2: Multiple failed logins (>3)
    if (activity.failedLogins > 3) {
        return { is_anomaly: true, reason: 'Multiple failed logins', risk_score: 85 };
    }

    // RULE 3: Sensitive actions
    const sensitive = ['DELETE_RECORD', 'ACCESS_ADMIN', 'EXPORT_DATA'];
    if (sensitive.includes(log.action)) {
        return { is_anomaly: true, reason: `Sensitive action: ${log.action}`, risk_score: 60 };
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
