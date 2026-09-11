# PJOK ARENA — Cerdas Cermat PJOK Kelas VII

Website game kuis PJOK SMP Kelas VII, mobile-first dan dapat di-host gratis dengan GitHub Pages.

## Isi
- Registrasi username, nama, kelas
- Quick / Standard / Challenge
- Timer 15 detik per soal
- Skor, XP, akurasi, hasil akhir
- Bank soal dari contoh tes pada `PERANGKAT AJAR DENNY.pdf`
- Leaderboard lokal + entry Peringkat Sepuh

## Deploy GitHub Pages
1. Buat repository public.
2. Upload semua file di folder ini ke branch `main`.
3. Repository → Settings → Pages.
4. Source: Deploy from a branch.
5. Branch: `main`, folder: `/root`.
6. Save dan tunggu proses build.

## Catatan
Versi ini statis. `localStorage` dipakai untuk menyimpan profil/skor di browser. Untuk akun dan leaderboard lintas perangkat, tambahkan backend/database pada fase berikutnya.
