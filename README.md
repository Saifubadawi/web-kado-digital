# 🎂 Web Kado Digital - Interactive Birthday Gift

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Aplikasi web kado ulang tahun digital yang interaktif, estetik, dan sinematik. Dirancang khusus untuk memberikan pengalaman momen ulang tahun yang berkesan dan personal melalui gabungan musik latar, efek animasi kelopak bunga/kelap-kelip/konfeti, simulasi tiup lilin, galeri kenangan, serta pesan ucapan mendalam.

---

## ✨ Fitur Utama

- **🎁 Opening Scene Interaktif**: Tampilan pembuka yang elegan dengan pesan bertahap dan musik instrumental pendukung.
- **🕯️ Simulasi Tiup Lilin**: Interaksi unik menahan/meniup lilin ulang tahun secara virtual lengkap dengan efek nyala api, asap, dan progress ring.
- **🌌 Pesan Sinematik (Dark Message)**: Narasi teks yang muncul perlahan untuk menciptakan suasana emosional.
- **✨ Kartu Permohonan (Wish)**: Penerima kado dapat memilih *wish* permohonan ulang tahun mereka sendiri.
- **🖼️ Galeri Kenangan Hati**: Tampilan foto-foto kenangan berbentuk *heart grid* lengkap dengan pop-up modal dan *caption*.
- **💌 Surat Kecil & Kartu Ucapan**: Pesan tulisan tangan / surat hangat khusus yang dapat disesuaikan.
- **🌷 Buket Bunga Interaktif**: Elemen buket bunga persahabatan/kasih sayang beserta makna dan filosofinya.
- **🎶 Pemutar Musik Latar (BGM)**: Pemutar lagu bawaan yang bisa dimainkan dan dijeda sesuai keinginan.
- **📱 Responsif & Ringan**: Sangat nyaman diakses melalui perangkat seluler (*smartphone*) maupun desktop tanpa memerlukan *framework* berat.

---

## 📁 Struktur Proyek

```text
Hadia2/
├── index.html            # Halaman utama aplikasi web
├── README.md             # Dokumentasi proyek
├── css/
│   ├── style.css         # Styling utama & sistem warna
│   ├── animations.css    # Keyframe & efek animasi sinematik
│   └── responsive.css    # Penyesuaian tampilan mobile & desktop
├── js/
│   ├── app.js            # Inisialisasi utama aplikasi
│   ├── scenes.js         # Pengatur alur & transisi antar-adegan
│   ├── candle.js         # Logika interaksi tiup lilin
│   ├── wishes.js         # Logika kartu permohonan (wish)
│   ├── gallery.js        # Logika galeri foto & modal
│   ├── letter.js         # Logika animasi surat & kartu ucapan
│   └── effects.js        # Efek partikel, kelopak bunga & konfeti
├── data/
│   └── content.js        # ⚙️ PUSAT PENGATURAN KONTEN (Nama, Teks, Foto, dll)
├── assets/
│   └── images/
│       └── memories/     # Folder penyimpanan foto kenangan
└── music/
    ├── README.txt        # Instruksi penambahan audio
    └── bg-music.mp3      # File musik latar (audio MP3)
```

---

## 🛠️ Cara Mengubah Konten (Kustomisasi)

Semua nama, teks ucapan, pesan surat, pilihan wish, hingga daftar foto dapat disesuaikan dengan sangat mudah **tanpa mengubah struktur HTML/CSS**:

### 1. Mengubah Nama & Teks Ucapan
Buka file `data/content.js`, lalu ubah nilai properti di dalamnya:
- `recipientName`: Nama penerima kado.
- `senderName`: Nama pengirim.
- `opening`: Teks pembuka.
- `candle`: Instruksi dan pesan tiup lilin.
- `darkMessage`: Pesan sinematik.
- `letter`: Isi surat ucapan ulang tahun.

### 2. Mengubah Foto Galeri
1. Masukkan foto-foto Anda ke dalam folder `assets/images/memories/` (misal: `photo-01.jpg`, `photo-02.jpg`, dst).
2. Sesuaikan jalur file dan teks keterangan (*caption*) pada bagian `gallery.photos` di `data/content.js`.

### 3. Mengubah Musik Latar
1. Siapkan file lagu favorit dalam format **MP3**.
2. Masukkan ke dalam folder `music/` dan beri nama file `bg-music.mp3`.

---

## 🚀 Cara Menjalankan di Lokal

1. **Clone repositori ini**:
   ```bash
   git clone https://github.com/USERNAME/web-kado-digital.git
   cd web-kado-digital
   ```
2. **Jalankan Aplikasi**:
   - Cukup buka file `index.html` langsung di peramban web (*browser*) Anda (Chrome, Edge, Firefox, Safari).
   - Atau gunakan ekstensi **Live Server** di VS Code untuk pengalaman pengujian lokal terbaik.

---

## 🌐 Cara Deploy Gratis ke Internet (GitHub Pages)

Agar kado digital ini bisa langsung dibuka melalui tautan oleh penerima:

1. **Push proyek ini ke GitHub**:
   ```bash
   git add .
   git commit -m "Feat: Siapkan kado digital ulang tahun"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
2. **Aktifkan GitHub Pages**:
   - Buka halaman repositori Anda di GitHub.
   - Masuk ke menu **Settings** > **Pages**.
   - Pada bagian **Build and deployment** -> **Source**, pilih `Deploy from a branch`.
   - Pada bagian **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.
   - Tunggu 1-2 menit, link kado digital Anda akan siap dibagikan! 🎉

---

## 💻 Teknologi yang Digunakan

- **HTML5**: Struktur halaman semantik.
- **CSS3 / Vanilla CSS**: Animasi halus, Flexbox, CSS Grid, Glassmorphism & efek partikel.
- **JavaScript (ES6+)**: Logika interaktif modular tanpa *dependency* eksternal.

---

## 📝 Lisensi


Proyek ini dibuat untuk tujuan hiburan, kado personal, dan pembelajaran. Bebas digunakan dan dimodifikasi! ❤️