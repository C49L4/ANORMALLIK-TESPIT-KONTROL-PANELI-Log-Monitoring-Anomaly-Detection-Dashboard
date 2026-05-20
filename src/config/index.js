require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret',
    SIMULATOR_INTERVAL: parseInt(process.env.SIMULATOR_INTERVAL) || 3000,
    MAX_LOGS: parseInt(process.env.MAX_LOGS) || 500,
    MAX_ANOMALIES: parseInt(process.env.MAX_ANOMALIES) || 200
};
