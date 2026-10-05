# TugasRapi

Tracker tugas kuliah untuk mahasiswa. Kelola tugas, mata kuliah, deadline, prioritas, dan status dalam satu agenda.

Dibangun dengan HTML, CSS, dan JavaScript tanpa dependensi runtime.

## Masalah dan solusi

Tugas dari beberapa mata kuliah sering tersebar di chat dan catatan. TugasRapi menggabungkannya dalam satu dashboard agar mahasiswa bisa melihat pekerjaan aktif dan deadline terdekat.

## Fitur

- Tambah, lihat, edit, dan hapus tugas dengan konfirmasi.
- Judul, mata kuliah, deadline, prioritas, catatan, dan status selesai.
- Pencarian judul/mata kuliah; filter semua, aktif, selesai, dan terlambat.
- Urutan deadline atau prioritas; ringkasan deadline dalam tiga hari.
- Penyimpanan lokal dan data contoh opsional; desain responsif.

## Menjalankan

Gunakan Python 3 dari root repository:

```sh
python -m http.server 8080
```

Buka http://localhost:8080. Tidak perlu instalasi npm atau build. Gunakan browser modern dengan JavaScript aktif.

Demo: https://ezradesmonds.github.io/TugasRapi/

## Pengujian

Dengan Node.js:

```sh
node --check app.js
node test.cjs
```

`test.cjs` menguji validasi data, tanggal kalender, penyimpanan, data rusak, ID duplikat, kegagalan penulisan, serta status terlambat. Uji browser meliputi CRUD, reload, pencarian, filter, input HTML sebagai teks, dan ukuran mobile. Lihat `migration-notes.md` untuk bukti dan batas pengujian.

## Deployment

GitHub Pages: Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save. Setiap push ke `main` memicu publikasi ulang. Semua URL aset relatif sehingga bekerja di subpath `/TugasRapi/`.

## Catatan AI

Codex membantu menyusun tampilan, menulis HTML/CSS/JavaScript, menerapkan CRUD dan validasi, membuat pengujian, mendokumentasikan proyek, serta menyiapkan deployment. Kilo Code digunakan dalam latihan terpisah untuk bug fixing dan percobaan prompt CRUD, bukan untuk menghasilkan kode repository ini. Riwayat commit merekam tahap pekerjaan nyata.

## Batasan

Data hanya tersimpan pada browser dan origin yang digunakan, bukan di GitHub atau server. Menghapus data browser dapat menghilangkan tugas. Belum ada sinkronisasi perangkat, login, pengingat otomatis, atau backup/export. Gunakan satu tab untuk mengedit agar perubahan antar-tab tidak saling menimpa. Tanggal memakai kalender lokal perangkat. Proyek ini prototipe tugas kuliah, bukan layanan kolaborasi produksi.
