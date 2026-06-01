const mongoose = require('mongoose');

let cachedConnection = null;

async function connectDatabase() {
  const databaseUrl = String(process.env.DATABASE_URL || process.env.MONGODB_URI || '').trim();

  if (!databaseUrl || databaseUrl === 'your_database_url') {
    console.warn('[app] DATABASE_URL belum diatur. Aplikasi berjalan memakai mode demo memory.');
    return false;
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    mongoose.set('strictQuery', true);
    cachedConnection = await mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true
    });
    console.log('[app] Database tersambung.');
    return true;
  } catch (error) {
    console.error('[app] Gagal tersambung ke database. Mode demo memory digunakan.');
    return false;
  }
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDatabase, isDatabaseReady };
