# PJOK ARENA — FINAL FIX

Website Cerdas Cermat PJOK SMP Kelas VII.

## Perbaikan utama
- Avatar menggunakan 100 file crop PNG yang berasal dari avatar-sheet-100.png agar tampil konsisten di Profile dan Leaderboard.
- Tombol Quiz di navigasi membuka **PILIH QUIZ** terlebih dahulu.
- Mode Quiz: Quiz Cepat, Simulasi, dan Latihan Bab.
- Profil disimpan persisten di localStorage dengan migrasi dari key versi lama.
- Profil tidak perlu registrasi ulang selama data browser tidak dihapus.
- Leaderboard tidak memakai data demo.
- Peringkat Sepuh tetap Denny Agustiana S.Pd dengan 999999999 poin.
- Backsound YouTube tetap memakai video ID BpcdiYYEmvE.

## Struktur avatar
`assets/profile/avatar-sheet-100.png` adalah sumber 10x10. Website memakai hasil crop di `assets/profile/avatars/01.png` sampai `100.png` agar crop tidak bergantung pada CSS sprite scaling.


## Login siswa
Siswa wajib memakai username + password. Di Supabase Authentication > Providers > Email, matikan Confirm email karena website membuat email internal `username@pjokarena.local` dan siswa tidak memasukkan email. Jalankan `supabase-setup.sql` sekali.
