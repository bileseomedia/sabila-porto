# Sabila Alifia Sundawa — Creative Portfolio

Website portfolio (React + Vite + Tailwind CSS) dengan backend Supabase (database, storage, autentikasi admin).
Desain, layout, warna, tipografi, animasi, Radial Navigation, Vertical Typography, serta Light/Dark Mode dipertahankan dari prototype.

## Struktur project

```
src/
  App.jsx                  # Perakit halaman + state UI (modal, lightbox, scroll-spy)
  index.css                # Font utilities, keyframes animasi, scrollbar
  data/defaultData.js      # Konten awal / fallback + daftar kategori
  lib/
    supabase.js            # Client Supabase (hanya anon key dari env)
    media.js               # Kompres gambar + upload/hapus file Storage
    portfolioService.js    # Baca, simpan (sync), dan realtime database
  hooks/                   # useTheme, usePortfolio, useAdminAuth
  components/              # Header, RadialNav, EditorialFrame, Lightbox, ProjectModal, Toast
  sections/                # Hero, About, Experience, Organization, Showcase, Projects, Skills, Contact
  admin/                   # AdminDashboard + tabs (Profil, Pengalaman, Organisasi, Projects, Vertical, Kontak)
supabase/schema.sql        # Tabel, RLS, Storage bucket, Realtime
```

## Instalasi lokal

```bash
npm install
cp .env.example .env.local     # lalu isi nilainya (langkah 2 di bawah)
npm run dev
```

Tanpa `.env.local`, website tetap tampil memakai konten awal, tetapi admin dashboard tidak dapat login/menyimpan.

## Setup Supabase

1. Buat project di https://supabase.com.
2. **Project Settings → API**: salin `Project URL` dan `anon public key` ke `.env.local`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). **Jangan pernah memakai `service_role` key di frontend.**
3. **SQL Editor**: tempel & jalankan seluruh isi `supabase/schema.sql`.
4. **Authentication → Providers → Email**: aktif. Lalu **Authentication → Users → Add user** (email + password admin).
   Setelah itu nonaktifkan pendaftaran publik: **Authentication → Sign In / Providers → matikan "Allow new users to sign up"**.
5. Daftarkan akun tadi sebagai admin (SQL Editor):
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'EMAIL_ADMIN_ANDA';
   ```
6. Jalankan website, buka **Studio Admin**, login, lalu klik **Simpan Semua Perubahan** sekali untuk
   menyimpan konten awal ke database. Setelah itu seluruh konten dikelola dari dashboard.

## Keamanan

- Row Level Security aktif di semua tabel: publik hanya boleh **membaca**; tulis/ubah/hapus hanya untuk user yang ada di `admin_users` (`public.is_admin()`).
- Storage bucket `portfolio-media`: baca publik, upload/ubah/hapus hanya admin; batas 20 MB; hanya JPG/PNG/WEBP/MP4/WEBM.
- Hanya `anon key` yang ada di frontend. Tidak ada passcode yang di-hardcode (passcode `SABILA2025` di prototype sudah dihapus).
- `.env*` masuk `.gitignore`; hanya `.env.example` (kosong) yang di-commit.

## Deploy ke GitHub & Vercel

```bash
git init && git add . && git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/USERNAME/sabila-portfolio.git
git push -u origin main
```

1. Vercel → **Add New Project** → import repo GitHub (preset Vite terdeteksi otomatis; `vercel.json` sudah disediakan).
2. **Environment Variables**: isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
3. Deploy. Setelah domain Vercel aktif, tambahkan di Supabase **Authentication → URL Configuration → Site URL**.

## Catatan penggunaan

- Foto diunggah langsung ke Supabase Storage (gambar dikompres ke WEBP di browser). Foto yang diganti/dihapus akan dibersihkan dari Storage saat menekan **Simpan Semua Perubahan**.
- Perubahan yang disimpan muncul di website publik secara langsung (Supabase Realtime).
- Tombol "Kelola Galeri" / "Tambah Foto" di halaman publik hanya tampil untuk admin yang sedang login.
