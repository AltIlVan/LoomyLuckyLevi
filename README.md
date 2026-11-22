# 🕹️ LOOMY'S LUCKY LOOT — Personalized Birthday Arcade for Levina

Sebuah website arcade gashapon / claw machine interaktif bertema **Modern Retro Arcade & Bold Playful Brutalism**, dirancang khusus sebagai kado digital yang unik, hangat, dan playful untuk **Levina**.

---

## ✨ Fitur Utama

1. **Opening Experience & Scrapbook 3D Theater Ticket**:
   - Background animasi shifting gradient yang lembut dan elegan.
   - Efek teks pembuka puitis bertahap (*"Somewhere, something is waiting for you..."*).
   - Vintage 3D Theater Pass (*"NO. 001 — BIRTHDAY EDITION"*).
   - Klik/tap kartu untuk melakukan animasi 3D flip membaca pesan rahasia dari Loomy.
   - Tombol tactile **"LET'S PLAY!"** untuk masuk ke arcade.

2. **Mobile-First Interactive Claw Machine**:
   - Kabinet arcade retro dengan lampu marquee kedip warna-warni.
   - Ruang akrilik transparan dengan bola kapsul 3D glossy beragam warna di dalamnya.
   - Kontrol capit realistis: tombol panah kiri-kanan, slider sentuh (mobile-friendly), serta support keyboard.
   - Tombol **GRAB CAPSULE** dengan animasi capit turun, mencengkeram kapsul, mengangkat, menggeser ke lubang chute, dan menjatuhkan hadiah ke pintu dispenser!
   - 100% Win-rate yang forgiving (selalu dapat hadiah dan tidak pernah duplikat).

3. **6 Kategori Kapsul Unik**:
   - 🔵 **BLUE — CLOUDY DAYS**: Pesan penenang, anti-overthinking, dan safe harbor.
   - 🟡 **HAPPY PILLS**: Candaan receh, pujian anti-cringe, dan serotonin booster.
   - 🌸 **PINK — SWEET NOTHINGS**: Apresiasi tulus dan surat kasih sayang.
   - 🟢 **GREEN — LUCKY CHARMS**: Doa ulang tahun dan traktiran hang-out/kopi.
   - 🟣 **PURPLE — MYSTERY MEAT**: Tantangan random, ramalan absurd, dan wildcard seru.
   - 👑 **GOLD — SPECIAL DROP**: Hadiah fisik/voucher kado ultah spesial di dunia nyata.

4. **"THE LOOT BOOK" (Collection Vault)**:
   - Album koleksi stiker scrapbook pribadi.
   - Kapsul yang belum didapat tampil sebagai siluet misterius bertanda tanya.
   - Kapsul yang sudah terbuka dapat dibuka dan dibaca ulang kapan saja.
   - Progress counter & bar persentase (misal: 14 / 24 Unlocked).
   - Perayaan khusus saat seluruh 24 kapsul berhasil dikoleksi!

5. **Audio Synthesizer Web Audio API**:
   - 100% efek suara 8-bit retro disintesis langsung di browser (suara koin, motor capit, jepitan, jatuh perosotan, letupan kapsul, dan nada kemenangan).
   - Bebas kendala file audio hilang/404 pada GitHub Pages.
   - Dilengkapi tombol toggle Mute/Unmute.

---

## 💾 Sistem Penyimpanan & GitHub Pages (Static Hosting)

Website ini **100% static-ready** dan dirancang khusus agar langsung berjalan sempurna di **GitHub Pages**:

### 1. Standalone / Local Persistence (Bawaan Langsung Aktif)
- Tanpa setup database sama sekali, progres Levina **tetap tersimpan secara otomatis** di browser melalui `localStorage` berbasis **Birthday Player Token**.
- Default token: `levina-birthday-no001`.
- Anda juga bisa membagikan link khusus seperti:  
  `https://username.github.io/repo-name/?token=levi-bday-loot`  
  Semua progres kapsul yang dibuka akan tersimpan aman di token tersebut dan tidak akan hilang saat browser di-refresh atau dikunjungi lagi.

### 2. Optional Supabase Cloud Sync
- Jika ingin menghubungkan ke Supabase Postgres database untuk sinkronisasi cloud antar-perangkat:
  1. Jalankan script SQL yang sudah disediakan di file `supabase/schema.sql` pada SQL Editor Supabase Anda.
  2. Buka icon ⚙️ (Settings) di pojok kanan atas aplikasi, lalu masukkan **Project URL** dan **Anon Key**, atau simpan di `.env`:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
  3. Aplikasi akan otomatis tersinkronisasi dua arah tanpa merusak penyimpanan lokal.

---

## 🚀 Cara Upload ke GitHub Pages

Proyek ini sudah dilengkapi file workflow otomatis: `.github/workflows/deploy.yml` dan konfigurasi `base: './'` pada `vite.config.ts`.

### Langkah Cepat:
1. Buat repository baru di GitHub (misal: `loomy-lucky-loot`).
2. Di terminal lokal, inisialisasi git dan push:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for Levina's Birthday Arcade"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
3. Buka repository Anda di GitHub:
   - Buka menu **Settings** > **Pages**.
   - Pada bagian **Build and deployment > Source**, pilih **GitHub Actions**.
4. GitHub Actions akan otomatis melakukan build dan website langsung aktif di `https://<username>.github.io/<repo-name>/`!

---

## 📝 Personalisasi Pesan Kado

Anda dapat mengubah atau menambah isi ucapan dan hadiah kapan saja dengan sangat mudah:
- **Pesan Ulang Tahun di Belakang Tiket**: Edit di `src/data/defaultConfig.ts`.
- **Daftar Kapsul & Hadiah**: Edit di `src/data/rewardsData.ts`.
