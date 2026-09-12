# PJOK ARENA — FULL FINAL UI

Cerdas Cermat PJOK SMP Kelas VII. Paket ini adalah baseline website yang sudah dipoles untuk mobile: navbar, kontras panel, background layering, quiz flow, profile, avatar 100, dan leaderboard.

## Upload ke GitHub Pages
Semua file di paket ini sudah berada di ROOT. Upload `index.html`, `style.css`, `app.js`, `questions.js`, `.nojekyll`, `supabase-setup.sql`, dan folder `assets/` ke root repository.

## Supabase
Jika ingin reset database testing dari nol, jalankan `supabase-setup.sql` SEKALI di SQL Editor. SQL ini menghapus akun/data lama. Setelah itu di Authentication > Providers > Email: Email provider ON, sign-up ON, Confirm email OFF. Jangan gunakan service-role/secret key di frontend.

## Login
Siswa memakai username + password. Website mengubah username menjadi email internal `username@pjokarena.local` untuk Supabase Auth; siswa tidak perlu mengetahui email tersebut.

## Asset yang bisa diganti tanpa merombak kode
- `assets/home/hero.jpg` — karakter utama Home
- `assets/home/bg-home.jpg` — background Home
- `assets/quiz/quiz-bg.jpg` — background Quiz
- `assets/leaderboard/leaderboard-bg.jpg` — background Leaderboard
- `assets/profile/profile-bg.jpg` — background Profile
- `assets/result/result-bg.jpg` — background Result
- `assets/announcement/announcement-bg.jpg` — background Pengumuman
- `assets/about/about-bg.jpg` — background Tentang Pa Denny
- `assets/profile/avatars/01.png` ... `100.png` — avatar siswa

## Catatan
Ikon bottom navigation pada versi ini ditanam langsung sebagai SVG inline di `index.html`, sehingga tidak bergantung pada file ikon eksternal untuk tampil.

Backsound memakai YouTube dan autoplay audio dapat dibatasi browser mobile sampai ada interaksi pengguna.
