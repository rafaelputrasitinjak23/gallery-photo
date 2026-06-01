require('dotenv').config();

const app = require('./app');
const { connectDatabase } = require('./config/database');
const { startCleanupSchedule, cleanupExpiredResults } = require('./utils/cleanup');
const { ensureDefaultAdmin, seedTemplatesIfEmpty } = require('./controllers/adminController');

const PORT = Number(process.env.PORT || 3000);

async function bootstrap() {
  await connectDatabase();
  await seedTemplatesIfEmpty();
  await ensureDefaultAdmin();
  await cleanupExpiredResults().catch(() => null);
  startCleanupSchedule();

  app.listen(PORT, () => {
    console.log(`[app] Server berjalan di http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('[app] Server gagal dijalankan.');
  process.exit(1);
});
