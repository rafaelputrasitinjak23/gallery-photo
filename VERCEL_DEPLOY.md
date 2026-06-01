# Deploy ke Vercel

Project ini sudah disiapkan untuk Vercel dengan entry serverless di `api/index.js` dan routing di `vercel.json`.

## Environment Variables di Vercel

Isi menu **Project Settings → Environment Variables**:

```env
APP_URL=https://nama-project.vercel.app
SESSION_SECRET=ganti_dengan_secret_panjang_random
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/gallery_template_app?retryWrites=true&w=majority
MONGODB_URI=
USE_MONGO_SESSION=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password_admin_minimal_8
AUTO_DELETE_HOURS=24
NODE_ENV=production
```

Catatan:

- Boleh pakai `DATABASE_URL` atau `MONGODB_URI`. Kalau keduanya diisi, `DATABASE_URL` dipakai lebih dulu.
- Untuk Vercel, disarankan `USE_MONGO_SESSION=true` supaya login admin dan riwayat berbasis session tidak hilang saat serverless cold start.
- Jangan upload file `.env` asli ke GitHub atau Vercel.

## Build Settings

Di Vercel biasanya cukup default:

- Framework Preset: **Other**
- Install Command: `npm install`
- Build Command: kosongkan atau `npm run vercel-build`
- Output Directory: kosongkan

## Setelah Deploy

Buka URL project lalu cek:

```txt
/
/templates
/admin/login
```

Admin otomatis dibuat dari `ADMIN_EMAIL` dan `ADMIN_PASSWORD` saat serverless function pertama kali berjalan.
