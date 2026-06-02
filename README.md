# Aesthetic Gallery Template Foto

Website galeri template foto estetik berbasis Express.js, EJS, MongoDB, WebRTC camera, dan HTML Canvas. User dapat memilih template, membuka kamera depan/belakang, mengambil foto ke slot template, mengedit teks/filter/posisi foto, lalu download PNG/JPG.

## Fitur Utama

- Landing page estetik dengan preview template melayang.
- Halaman daftar template dengan search dan filter kategori.
- 10 template awal siap pakai.
- Kamera depan dan belakang menggunakan WebRTC.
- Multi-slot capture otomatis masuk ke template.
- Editor canvas untuk teks, caption, tanggal, warna, font, filter, zoom, rotate, dan posisi foto.
- Download PNG/JPG dan Web Share API jika browser mendukung.
- Riwayat hasil berbasis session/browser.
- Auto delete hasil lama memakai TTL database dan scheduler.
- Admin panel untuk tambah, edit, hapus, aktif/nonaktif template.
- Error publik aman, tanpa stack trace atau detail database.

## Cara Menjalankan

```bash
npm install
cp .env.example .env
npm run dev
```

Buka:

```txt
http://localhost:3000
```

## Environment

Isi file `.env` dari `.env.example`:

```env
APP_URL=http://localhost:3000
SESSION_SECRET=isi_secret_panjang
DATABASE_URL=mongodb_connection_url
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password_admin
AUTO_DELETE_HOURS=24
NODE_ENV=development
PORT=3000
```

Jangan upload `.env` ke GitHub atau hosting publik.

## Seed Template

Template otomatis dimasukkan saat database kosong. Bisa juga dijalankan manual:

```bash
npm run seed
```

## Admin Panel

```txt
/admin/login
```

Gunakan `ADMIN_EMAIL` dan `ADMIN_PASSWORD` dari `.env`. Saat MongoDB aktif, akun admin akan dibuat atau diperbarui otomatis dari environment tersebut.

## Catatan Kamera

Kamera browser biasanya membutuhkan HTTPS, kecuali di `localhost`. Jika kamera gagal dibuka, pastikan izin kamera aktif dan akses menggunakan browser modern.

## Privasi

Hasil foto disimpan sementara. Secara default hasil lama akan dihapus setelah 24 jam melalui field `expiresAt` dan TTL index MongoDB. Kamu bisa mengubah durasi melalui `AUTO_DELETE_HOURS`.

## Struktur Penting

```txt
src/views/pages/create.ejs      halaman kamera
src/views/pages/editor.ejs      editor canvas
public/js/camera.js             logic kamera depan/belakang
public/js/editor.js             logic editor/download/share
public/js/template-renderer.js  renderer canvas template
src/data/initialTemplates.js    10 template awal
scripts/seedTemplates.js        seed database
```

## Deployment

Untuk deploy ke platform seperti Vercel/Render/Railway:

1. Upload project.
2. Set environment variable dari `.env.example` di dashboard hosting.
3. Jangan upload `.env` asli.
4. Pastikan `DATABASE_URL` valid.
5. Jalankan build/start sesuai platform dengan command `npm start`.

## Keamanan

Aplikasi memakai `helmet`, `express-rate-limit`, `express-session`, validasi input, sanitasi output, dan safe error handler. Jangan pernah menaruh credential MongoDB atau data rahasia di file frontend, README, atau source code publik.
## Catatan Session MongoDB

Secara default session memakai memory store lokal agar project tetap bisa jalan walaupun `DATABASE_URL` belum diisi. Jika ingin session admin disimpan ke MongoDB, isi `DATABASE_URL` dengan URI MongoDB valid lalu ubah:

```env
USE_MONGO_SESSION=true
```

Jangan isi `DATABASE_URL` dengan `null`, `undefined`, atau string kosong.

## Deploy ke Vercel

Versi ini sudah mendukung Vercel melalui `api/index.js` dan `vercel.json`.

Environment penting di Vercel:

```env
APP_URL=https://nama-project.vercel.app
SESSION_SECRET=ganti_dengan_secret_panjang_random
DATABASE_URL=mongodb+srv://...
USE_MONGO_SESSION=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password_admin
AUTO_DELETE_HOURS=24
NODE_ENV=production
```

Detail lengkap ada di `VERCEL_DEPLOY.md`.

## Optimasi Mobile Terbaru

Versi ini sudah dioptimalkan agar halaman utama lebih ringan di HP:

- Preview template sudah diganti menjadi gambar hasil akhir yang berbeda untuk setiap template.
- Ukuran preview PNG diperkecil dan dioptimasi.
- Asset preview WebP juga disediakan di folder template.
- Gambar template memakai lazy loading dan async decoding.
- Halaman utama hanya menampilkan template populer, sedangkan semua template tetap ada di halaman `/templates`.
- Efek blur, shadow, dan animasi dikurangi otomatis di layar mobile.
- Static asset di Vercel diberi cache header agar kunjungan berikutnya lebih ringan.

Jika template dari database masih terlihat lama, jalankan seed ulang atau update data `previewImage` template agar memakai file preview terbaru di folder `public/images/templates`.

## Update Fitur Lengkap

Versi ini sudah ditambah beberapa fitur tambahan agar lebih nyaman dipakai di HP:

- PWA: website bisa di-install seperti aplikasi melalui browser yang mendukung.
- Favorite template: tombol hati menyimpan pilihan di browser user.
- Preview besar: user bisa melihat contoh hasil template sebelum memilih.
- Filter cepat: Trending, Paling Ringan, 1 Foto, Story 9:16, dan Multi-slot.
- Share hasil: editor memakai Web Share API jika browser mendukung, dengan fallback download.
- Auto enhance foto: tombol Percantik menerapkan filter otomatis pada foto aktif.
- Crop langsung di canvas: drag untuk geser foto, scroll/pinch untuk zoom.
- Remix tema: pilihan Default, Cream, Pink, Blue, Dark, dan Minimal.
- Watermark opsional: user bisa mengaktifkan dan mengganti teks watermark.
- Draft otomatis: create page dan editor menyimpan draft lokal di browser.
- Kompres gambar: foto dari kamera dikompres sebelum disimpan agar lebih ringan di HP.

Catatan: draft dan favorite tersimpan di localStorage browser user, bukan database. Hasil final tetap mengikuti sistem riwayat dan auto-delete sesuai konfigurasi `AUTO_DELETE_HOURS`.
