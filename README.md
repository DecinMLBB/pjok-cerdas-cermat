# PJOK ARENA — FINAL FOUNDATION

Website Cerdas Cermat PJOK SMP Kelas VII, mobile-first dan siap dipasang di GitHub Pages.

## Fitur final
- Username + password melalui Supabase Auth dengan email internal `username@pjokarena.local`.
- Profile siswa dengan 100 avatar PNG individual.
- Username dikunci setelah akun dibuat agar identitas Auth tidak rusak; siswa dapat mengubah nama, kelas, dan avatar.
- Quiz: Quiz Cepat, Simulasi, dan Latihan Bab.
- Soal berasal dari bank soal `questions.js` yang disiapkan dari perangkat ajar PJOK kelas VII.
- Leaderboard online dari Supabase + Peringkat Sepuh Denny Agustiana S.Pd (999999999).
- Riwayat quiz dan statistik profile tersimpan online melalui `quiz_attempts`, dengan fallback lokal.
- Bottom navigation memakai asset SVG resmi di `assets/ui/`.
- Backsound YouTube dapat dinyalakan/dimatikan; autoplay tetap mengikuti kebijakan browser.
- Struktur asset sengaja dibuat berbasis file sehingga gambar dapat diganti kemudian tanpa mengubah logika aplikasi.

## Supabase — instalasi bersih
1. Buka Supabase > SQL Editor.
2. Paste seluruh isi `supabase-setup.sql` dan Run.
3. Buka Authentication > Providers > Email.
4. Pastikan Email provider aktif dan pendaftaran user diizinkan.
5. **Matikan Confirm email**. Website tidak meminta email siswa.

> `supabase-setup.sql` adalah script RESET TOTAL. Menjalankannya lagi akan menghapus akun dan data quiz yang ada.

## Asset
Gunakan nama file/folder yang sudah tersedia. Untuk mengganti visual, cukup ganti file dengan nama yang sama: `assets/home/hero.jpg`, background per halaman, dan asset UI.

## GitHub Pages
Upload seluruh isi folder ini ke repository, termasuk `.nojekyll`.
