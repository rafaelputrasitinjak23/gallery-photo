require('dotenv').config();

const mongoose = require('mongoose');
const Template = require('../src/models/Template');
const initialTemplates = require('../src/data/initialTemplates');

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl === 'your_database_url') {
    console.log('DATABASE_URL belum diatur. Isi .env terlebih dahulu.');
    process.exit(0);
  }

  await mongoose.connect(databaseUrl, { serverSelectionTimeoutMS: 8000 });

  for (const template of initialTemplates) {
    await Template.findOneAndUpdate(
      { slug: template.slug },
      template,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Seeded: ${template.name}`);
  }

  await mongoose.disconnect();
  console.log('Selesai seed template.');
}

run().catch(async (error) => {
  console.error('Seed gagal. Periksa koneksi database dan format data.');
  await mongoose.disconnect().catch(() => null);
  process.exit(1);
});
