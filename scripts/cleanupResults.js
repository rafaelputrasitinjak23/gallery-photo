require('dotenv').config();

const mongoose = require('mongoose');
const Result = require('../src/models/Result');

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl === 'your_database_url') {
    console.log('DATABASE_URL belum diatur. Tidak ada data database yang dibersihkan.');
    process.exit(0);
  }

  await mongoose.connect(databaseUrl, { serverSelectionTimeoutMS: 8000 });
  const deleted = await Result.deleteMany({ expiresAt: { $lte: new Date() } });
  await mongoose.disconnect();
  console.log(`Hasil lama terhapus: ${deleted.deletedCount || 0}`);
}

run().catch(async () => {
  console.error('Cleanup gagal. Silakan coba lagi.');
  await mongoose.disconnect().catch(() => null);
  process.exit(1);
});
