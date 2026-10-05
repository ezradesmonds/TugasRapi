# Catatan implementasi — 5 Oktober 2026

- Root: `D:\Documents\Ezra\Kuliah\PCU\Smstr 5\Genai\TugasRapi`.
- `index.html`: dashboard, formulir native dialog, konfirmasi hapus, labels dan status region.
- `style.css`, `icon.svg`: tampilan agenda dan ilustrasi SVG lokal; breakpoint 1100/800/480 px.
- `app.js`: CRUD, validasi, localStorage, pencarian, filter, pengurutan, ringkasan, contoh opsional.
- `test.cjs`: pengujian Node tanpa dependensi. PASS untuk validasi, tanggal, persistence, data rusak, ID duplikat, write failure, dan overdue.
- `node --check app.js`: PASS.
- Browser lokal: tambah, edit setelah reload, status selesai, filter terlambat, pencarian tanpa hasil, dan hapus dengan konfirmasi PASS. Input `<img src=x onerror=alert(1)>` ditampilkan sebagai teks.
- Mobile 390×844: screenshot diperiksa; scrollWidth 375 ≤ viewport 390 (tanpa overflow horizontal).
- Arsitektur: statis tanpa server/API/secret. Render input melalui textContent, localStorage ditulis sebelum state berubah, data rusak tidak ditimpa.
- Kinerja: filter O(n), sort O(n log n), cocok untuk daftar tugas pribadi. Daftar sangat besar belum diuji.
- Risiko: localStorage tidak terenkripsi, tanpa backup/sinkronisasi, edit beberapa tab belum disinkronkan. Browser selain Chrome dan audit aksesibilitas penuh belum diuji.
- Pages dikonfigurasi dari main/root. Status live dicatat setelah pemeriksaan deployment.
