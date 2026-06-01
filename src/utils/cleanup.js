const Result = require('../models/Result');
const { isDatabaseReady } = require('../config/database');
const memoryStore = require('./memoryStore');

async function cleanupExpiredResults() {
  if (isDatabaseReady()) {
    const deleted = await Result.deleteMany({ expiresAt: { $lte: new Date() } });
    return deleted.deletedCount || 0;
  }

  return memoryStore.cleanupExpiredResults();
}

function startCleanupSchedule() {
  const intervalMs = 60 * 60 * 1000;
  setInterval(() => {
    cleanupExpiredResults().catch(() => null);
  }, intervalMs).unref();
}

module.exports = { cleanupExpiredResults, startCleanupSchedule };
