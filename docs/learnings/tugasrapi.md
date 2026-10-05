# Pendekatan TugasRapi

Problem: membuat aplikasi mahasiswa yang dapat dicoba dan dipublikasikan cepat.
Context: repo kosong, hosting GitHub Pages, pengguna meminta commit/push bertahap.
Failed paths: root lama sudah diganti pengguna; git sandbox gagal melalui proxy lokal; gh tidak login.
Working approach: scaffold di work dengan apply_patch, salin file spesifik ke root D yang diotorisasi, git push melalui eksekusi berizin, konfigurasi Pages lewat sesi GitHub browser pengguna. Gunakan HTML/CSS/JS dan localStorage tanpa dependensi runtime.
Evidence: commit nyata tiap milestone, node syntax check dan test.cjs PASS, CRUD/reload/filter/input HTML diperiksa di browser, mobile tanpa overflow.
Reuse rule: validasi data tersimpan dan simpan perubahan sebelum mengganti state; jangan menimpa data rusak. Bedakan aktivasi Pages dari bukti situs live.
Weaker-model prompt: Baca AGENTS.md. Gunakan root TugasRapi yang sudah diverifikasi. Pertahankan aplikasi statis tanpa dependensi. Jangan render input dengan innerHTML. Uji CRUD, reload, validasi, write failure, dan mobile. Commit/push progres nyata. Verifikasi URL live sebelum klaim deployed; catat bukti dan batas pengujian.

Skill extract-approach tidak ditemukan pada katalog atau folder skills; catatan ini menerapkan format learning note yang diminta AGENTS.md secara langsung.
