// In-memory data store (replaces a real database for now)
// Can be swapped with PostgreSQL later without changing the rest of the code

const config = require('../config');

const severityRanges = {
    low: [0, 30],
    medium: [31, 60],
    high: [61, 80],
    critical: [81, 100]
};

const normalizeSeverity = (value) => {
    if (typeof value === 'string') return value.toLowerCase();
    if (typeof value === 'number') {
        if (value > 80) return 'critical';
        if (value > 60) return 'high';
        if (value > 30) return 'medium';
        return 'low';
    }
    return 'unknown';
};

const matchesSeverity = (logSeverity, querySeverity) => {
    if (!querySeverity) return true;
    const normalizedQuery = querySeverity.toLowerCase();

    if (typeof logSeverity === 'number') {
        const [min, max] = severityRanges[normalizedQuery] || [0, 100];
        return logSeverity >= min && logSeverity <= max;
    }

    return normalizeSeverity(logSeverity) === normalizedQuery;
};

const parseTimestamp = (log) => {
    const candidate = log.timestamp || log.time || log.Timestamp;
    const value = candidate ? new Date(candidate) : null;
    return value instanceof Date && !isNaN(value) ? value : null;
};

const store = {
    logs: [],
    anomalies: [],
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
        return this.logs.filter((l) => {
            const timestamp = parseTimestamp(l);
            return timestamp && timestamp > cutoff;
        });
    },

    getLatestLogs(limit = 1000) {
        return this.logs.slice(0, limit);
    },

    queryLogs({ page = 1, pageSize = 50, search, severity, start, end } = {}) {
        let filtered = this.logs;

        if (search) {
            const term = search.toString().toLowerCase();
            filtered = filtered.filter((log) => {
                return [log.user, log.action, log.source, log.status, log.Anomaly_Type, log.Severity]
                    .filter(Boolean)
                    .some((field) => field.toString().toLowerCase().includes(term));
            });
        }

        if (severity && severity.toLowerCase() !== 'all') {
            filtered = filtered.filter((log) => {
                if (log.Severity) return matchesSeverity(log.Severity, severity);
                return matchesSeverity(log.risk, severity);
            });
        }

        if (start || end) {
            const startDate = start ? new Date(start) : null;
            const endDate = end ? new Date(end) : null;
            filtered = filtered.filter((log) => {
                const timestamp = parseTimestamp(log);
                if (!timestamp) return false;
                if (startDate && timestamp < startDate) return false;
                if (endDate && timestamp > endDate) return false;
                return true;
            });
        }

        const total = filtered.length;
        const startIndex = (page - 1) * pageSize;
        const pageItems = filtered.slice(startIndex, startIndex + pageSize);

        return {
            total,
            page,
            pageSize,
            logs: pageItems
        };
    },

    aggregateLogs(interval = 'hour', limit = 1000) {
        const logs = this.getLatestLogs(limit).slice().reverse();
        const buckets = {};

        logs.forEach((log) => {
            const timestamp = parseTimestamp(log);
            if (!timestamp) return;

            const bucketKey = interval === 'day'
                ? timestamp.toISOString().slice(0, 10)
                : `${timestamp.toISOString().slice(0, 13)}:00`;

            if (!buckets[bucketKey]) {
                buckets[bucketKey] = { time: bucketKey, count: 0, totalRisk: 0 };
            }

            const risk = typeof log.risk === 'number'
                ? log.risk
                : normalizeSeverity(log.Severity) === 'critical' ? 90
                : normalizeSeverity(log.Severity) === 'high' ? 70
                : normalizeSeverity(log.Severity) === 'medium' ? 50
                : normalizeSeverity(log.Severity) === 'low' ? 20
                : 0;

            buckets[bucketKey].count += 1;
            buckets[bucketKey].totalRisk += risk;
        });

        return Object.values(buckets).map((bucket) => ({
            time: bucket.time,
            count: bucket.count,
            avgRisk: Math.round(bucket.totalRisk / bucket.count)
        }));
    },

    getStats() {
        const recent = this.getRecentLogs(1);
        const actionCounts = {};
        const severityCounts = {};
        const statusCounts = {};
        const sourceCounts = {};
        const users = new Set();

        this.logs.forEach((log) => {
            if (log.action) actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
            if (log.status) statusCounts[log.status] = (statusCounts[log.status] || 0) + 1;
            if (log.source) sourceCounts[log.source] = (sourceCounts[log.source] || 0) + 1;
            if (log.user) users.add(log.user);

            const sev = normalizeSeverity(log.Severity || log.risk);
            severityCounts[sev] = (severityCounts[sev] || 0) + 1;
        });

        return {
            total_logs: this.logs.length,
            total_anomalies: this.anomalies.length,
            logs_last_minute: recent.length,
            unique_users: users.size,
            actions: actionCounts,
            severity_counts: severityCounts,
            status_counts: statusCounts,
            source_counts: sourceCounts
        };
    },

    clearAll() {
        this.logs = [];
        this.anomalies = [];
    }
};

module.exports = store;
