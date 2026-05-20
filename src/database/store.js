// In-memory data store (replaces a real database for now)
// Can be swapped with PostgreSQL later without changing the rest of the code

const config = require('../config');

const store = {
    logs: [],
    anomalies: [],
    // Demo users for authentication
    users: [
        { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
        { id: '2', username: 'analyst', password: 'analyst123', role: 'analyst' }
    ],

    addLog(log) {
        this.logs.unshift(log);
        if (this.logs.length > config.MAX_LOGS) this.logs.pop();
    },

    addAnomaly(anomaly) {
        this.anomalies.unshift(anomaly);
        if (this.anomalies.length > config.MAX_ANOMALIES) this.anomalies.pop();
    },

    getRecentLogs(minutes = 1) {
        const cutoff = new Date(Date.now() - minutes * 60000);
        return this.logs.filter(l => new Date(l.timestamp) > cutoff);
    },

    clearAll() {
        this.logs = [];
        this.anomalies = [];
    }
};

module.exports = store;
