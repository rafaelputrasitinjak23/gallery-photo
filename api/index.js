const app = require('../src/app');
const { connectDatabase } = require('../src/config/database');
const { cleanupExpiredResults } = require('../src/utils/cleanup');
const { ensureDefaultAdmin, seedTemplatesIfEmpty } = require('../src/controllers/adminController');

let bootPromise = null;
let lastCleanupAt = 0;

async function bootstrapForVercel() {
  if (!bootPromise) {
    bootPromise = (async () => {
      await connectDatabase();
      await seedTemplatesIfEmpty();
      await ensureDefaultAdmin();
    })().catch((error) => {
      console.error('[app] Bootstrap Vercel gagal.');
      bootPromise = null;
      throw error;
    });
  }

  await bootPromise;

  const now = Date.now();
  if (now - lastCleanupAt > 60 * 60 * 1000) {
    lastCleanupAt = now;
    cleanupExpiredResults().catch(() => null);
  }
}

module.exports = async function handler(req, res) {
  try {
    await bootstrapForVercel();
    return app(req, res);
  } catch (error) {
    console.error('[safe-error] Vercel handler error');
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' }));
  }
};
