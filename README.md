---

## Dokumentasi Proyek: Spraydom

### 1. Gambaran Umum Proyek

Spraydom adalah aplikasi web berbasis React yang berfokus pada kesehatan dan kualitas tidur. Aplikasi ini menyediakan berbagai fitur untuk membantu pengguna meningkatkan kualitas tidur mereka, termasuk konten audio yang menenangkan, video panduan, rutinitas harian, mini-games, pemeriksaan insomnia, dan toko online untuk produk-produk terkait tidur.

Proyek ini dibangun dengan arsitektur frontend-backend yang terpisah, di mana frontend dihosting di Vercel dan backend di Google Cloud Run.

---

### 2. Spesifikasi Frontend

#### 2.1. Teknologi Stack

Frontend dibangun menggunakan teknologi modern berikut:

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM 7.8.2
- **Styling**: Tailwind CSS 4.1.13
- **State Management**: React Context API (AuthContext)
- **UI/UX**:
  - React Icons 5.5.0
  - Framer Motion 12.23.12 (untuk animasi)
  - Headless UI 2.2.7 (komponen UI yang tidak bergantung pada gaya)
- **Konten & Media**:
  - React Player 3.3.2 (untuk video)
  - React H5 Audio Player 3.10.1 (untuk audio)
  - React Markdown 10.1.0 (untuk rendering konten markdown)
  - CKEditor 5 44.3.0 (editor teks kaya)
- **Notifikasi**: React Hot Toast 2.6.0
- **Lainnya**: Swiper 11.2.10 (untuk carousel/slider)

#### 2.2. Struktur Proyek

```
src/
├── assets/          # Aset statis seperti gambar
├── components/      # Komponen UI yang dapat digunakan kembali
│   ├── AudioPlayerCustom.jsx
│   ├── BottomNav.jsx
│   ├── Carousel.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── SpotifyPlayer.jsx
│   ├── StarFadePuzzle.jsx
│   ├── TopHeader.jsx
│   └── VideoPlayerCustom.jsx
├── context/         # Konteks React untuk manajemen state global
│   └── AuthContext.jsx
├── data/           # Data statis dalam format JSON
│   ├── articles.json
│   ├── audios.json
│   └── products.json
├── pages/          # Komponen halaman untuk setiap rute
│   ├── AddAudio.jsx
│   ├── AddDreamlog.jsx
│   ├── AddProduct.jsx
│   ├── AddVideo.jsx
│   ├── Audio.jsx
│   ├── DailyRoutine.jsx
│   ├── Dreamlog.jsx
│   ├── DreamlogDetail.jsx
│   ├── EditAudio.jsx
│   ├── EditProduct.jsx
│   ├── FavoriteProducts.jsx
│   ├── Home.jsx
│   ├── InsomniaCheck.jsx
│   ├── LoginView.jsx
│   ├── MiniGames.jsx
│   ├── Product.jsx
│   ├── ProductDetail.jsx
│   ├── RegisterView.jsx
│   ├── Sleeptube.jsx
│   ├── Video.jsx
│   └── VideoDetail.jsx
├── services/       # Layanan untuk interaksi dengan API backend
│   └── api.js
├── App.jsx         # Komponen utama dengan konfigurasi rute
├── index.css       # Gaya global
└── main.jsx        # Titik masuk aplikasi
```

#### 2.3. Fitur Utama

- **Autentikasi**: Login dan registrasi pengguna dengan token JWT.
- **Konten Multimedia**: Halaman untuk audio, video (Sleeptube), dan daily routine.
- **E-commerce**: Katalog produk dengan detail produk, keranjang belanja, dan integrasi WhatsApp.
- **Favorit**: Sistem favorit produk menggunakan localStorage.
- **Dreamlog**: Jurnal mimpi yang bisa ditambah dan dilihat detailnya.
- **Mini Games**: Permainan sederhana seperti StarFadePuzzle.
- **Insomnia Check**: Alat untuk pemeriksaan tingkat insomnia.
- **Admin Panel**: Halaman khusus admin untuk menambah, mengedit, dan menghapus konten (produk, audio, video, dreamlog).

#### 2.4. Manajemen State

Manajemen state dilakukan menggunakan React Context API, khususnya `AuthContext` yang mengelola:
- Status autentikasi pengguna
- Data pengguna
- Token JWT
- Daftar produk favorit (disimpan di localStorage)

#### 2.5. Routing

Sistem routing menggunakan React Router dengan tiga jenis rute:
- **Rute Publik**: Dapat diakses oleh siapa saja (Home, Audio, Video, Product, dll.)
- **Rute Terproteksi**: Memerlukan pengguna untuk login (FavoriteProducts)
- **Rute Admin**: Hanya dapat diakses oleh pengguna dengan role 'admin' (AddProduct, EditProduct, dll.)

#### 2.6. Deployment

Frontend dihosting di **Vercel**, yang memungkinkan deployment otomatis setiap ada perubahan di repositori Git.

---

### 3. Spesifikasi Backend

#### 3.1. Teknologi Stack

Backend dibangun menggunakan Node.js dengan teknologi berikut:

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: Google Cloud Firestore 6.4.2 (NoSQL)
- **File Storage**: Google Cloud Storage 7.17.3
- **Autentikasi**: JWT (jsonwebtoken 9.0.0) dan bcryptjs 2.4.3
- **File Upload**: Multer 1.4.5-lts.1
- **Image Processing**: Sharp 0.34.5
- **Lainnya**: CORS, dotenv untuk manajemen variabel lingkungan

#### 3.2. Struktur Proyek

```
src/
├── config/         # Konfigurasi layanan eksternal
│   └── firestore.js
├── controllers/    # Logika bisnis untuk menangani request
│   ├── audioController.js
│   ├── authController.js
│   ├── dreamlogController.js
│   ├── productController.js
│   ├── uploadController.js
│   └── videoController.js
├── middleware/     # Middleware untuk memproses request
│   ├── auth.js
│   ├── uploadAudioFiles.js
│   ├── uploadFiles.js
│   ├── uploadImage.js
│   └── uploadVideo.js
├── models/         # Definisi model data untuk Firestore
│   ├── audioModel.js
│   ├── dreamlogModel.js
│   ├── productModel.js
│   ├── userModel.js
│   └── videoModel.js
├── routes/         # Definisi rute API
│   ├── audio.js
│   ├── auth.js
│   ├── dreamlog.js
│   ├── product.js
│   ├── upload.js
│   └── video.js
├── services/       # Layanan untuk interaksi dengan database dan storage
│   ├── audioService.js
│   ├── authService.js
│   ├── dreamlogService.js
│   ├── productService.js
│   ├── storageService.js
│   └── videoService.js
├── uploads/        # Folder sementara untuk file upload
└── utils/          # Fungsi utilitas
    ├── constants.js
    └── response-handler.js
```

#### 3.3. API Endpoints

Backend menyediakan REST API dengan endpoint berikut:

- **Autentikasi** (`/api/auth`):
  - `POST /register`: Registrasi pengguna baru
  - `POST /login`: Login pengguna
  - `GET /me`: Mendapatkan data pengguna yang sedang login

- **Produk** (`/api/products`):
  - `GET /`: Mendapatkan semua produk
  - `GET /:id`: Mendapatkan detail produk
  - `POST /`: Menambah produk baru (admin)
  - `PUT /:id`: Mengupdate produk (admin)
  - `DELETE /:id`: Menghapus produk (admin)

- **Audio** (`/api/audios`):
  - `GET /`: Mendapatkan semua audio
  - `GET /:id`: Mendapatkan detail audio
  - `POST /`: Menambah audio baru (admin)
  - `PUT /:id`: Mengupdate audio (admin)
  - `DELETE /:id`: Menghapus audio (admin)

- **Video** (`/api/videos`):
  - `GET /`: Mendapatkan semua video
  - `GET /:id`: Mendapatkan detail video
  - `POST /`: Menambah video baru (admin)
  - `PUT /:id`: Mengupdate video (admin)
  - `DELETE /:id`: Menghapus video (admin)

- **Dreamlog** (`/api/dreamlogs`):
  - `GET /`: Mendapatkan semua dreamlog
  - `GET /:id`: Mendapatkan detail dreamlog
  - `POST /`: Menambah dreamlog baru
  - `PUT /:id`: Mengupdate dreamlog
  - `DELETE /:id`: Menghapus dreamlog

- **Upload** (`/api/upload`):
  - `POST /image`: Upload gambar ke Google Cloud Storage
  - `POST /audio`: Upload audio ke Google Cloud Storage
  - `POST /video`: Upload video ke Google Cloud Storage

#### 3.4. Database & Storage

- **Google Cloud Firestore**: Digunakan sebagai database NoSQL utama untuk menyimpan data terstruktur seperti:
  - Data pengguna
  - Informasi produk
  - Metadata audio dan video
  - Dreamlog
  - Data lainnya yang memerlukan penyimpanan persisten

- **Google Cloud Storage**: Digunakan untuk menyimpan file media:
  - Gambar produk
  - File audio
  - File video
  - File lainnya yang memerlukan penyimpanan berkas

#### 3.5. Autentikasi & Keamanan

- **Autentikasi**: Menggunakan JSON Web Token (JWT) untuk autentikasi stateless.
- **Password Hashing**: Password pengguna di-hash menggunakan bcryptjs sebelum disimpan di database.
- **Middleware Autentikasi**: Middleware `auth.js` memverifikasi token JWT pada request yang memerlukan autentikasi.
- **Role-based Access Control**: Akses ke endpoint tertentu dibatasi berdasarkan peran pengguna (admin/user).

#### 3.6. File Upload

- **Multer**: Digunakan sebagai middleware untuk menangani `multipart/form-data` pada upload file.
- **Middleware Khusus**: Ada middleware khusus untuk setiap jenis file (gambar, audio, video) yang melakukan validasi sebelum upload.
- **Image Processing**: Menggunakan Sharp untuk memproses gambar (resize, optimasi) sebelum diupload ke Google Cloud Storage.

#### 3.7. Deployment

Backend dihosting di **Google Cloud Run**, platform serverless yang memungkinkan scaling otomatis berdasarkan traffic.

---

### 4. Arsitektur Sistem & Alur Data

#### 4.1. Arsitektur Umum

```
+----------------+      +----------------+      +---------------------+
|                |      |                |      |                     |
|   Frontend     |<---->|   Backend      |<---->| Google Cloud        |
|   (Vercel)     |      |   (Cloud Run)  |      | (Firestore & GCS)   |
|                |      |                |      |                     |
+----------------+      +----------------+      +---------------------+
```

1.  **Frontend (Vercel)**: Aplikasi React yang berjalan di browser pengguna.
2.  **Backend (Cloud Run)**: REST API yang berjalan di Google Cloud Run.
3.  **Database & Storage**: Google Cloud Firestore untuk data dan Google Cloud Storage untuk file media.

#### 4.2. Alur Data: Contoh Menambah Produk

1.  **Admin Login**:
   - Admin memasukkan kredensial di frontend.
   - Frontend mengirim request `POST /api/auth/login` ke backend.
   - Backend memverifikasi kredensial dan mengembalikan JWT jika valid.
   - Frontend menyimpan JWT di localStorage dan state.

2.  **Menambah Produk**:
   - Admin mengakses halaman "Tambah Produk" di frontend.
   - Admin mengisi form dan memilih gambar produk.
   - Saat submit, frontend mengirim request `POST /api/products` dengan data form dan file gambar.
   - Backend memverifikasi JWT menggunakan middleware `auth.js`.
   - Middleware `uploadImage.js` memproses upload gambar menggunakan Multer.
   - `productController.js` menerima data dan menggunakan `storageService.js` untuk mengupload gambar ke Google Cloud Storage.
   - `productController.js` menggunakan `productService.js` untuk menyimpan data produk (termasuk URL gambar) ke Firestore.
   - Backend mengembalikan respons sukses ke frontend.
   - Frontend menampilkan notifikasi sukses dan mengarahkan ke halaman daftar produk.

---

### 5. Mekanisme Pembuatan & Pengembangan

#### 5.1. Setup Lingkungan Pengembangan

**Frontend**:
```bash
# Clone repositori
git clone [repository-url]

# Masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Jalankan server pengembangan
npm run dev
```

**Backend**:
```bash
# Clone repositori
git clone [repository-url]

# Masuk ke direktori backend
cd backend

# Install dependencies
npm install

# Buat file .env dan konfigurasi variabel lingkungan
# PROJECT_ID, GCS_BUCKET_NAME, JWT_SECRET, dll.

# Jalankan server pengembangan
npm run dev
```

#### 5.2. Proses Build & Deployment

**Frontend**:
- Setiap push ke branch utama repositori Git akan memicu proses build dan deployment otomatis di Vercel.
- Vercel akan menjalankan `npm run build` dan menghosting hasilnya.

**Backend**:
- Backend di-deploy ke Google Cloud Run menggunakan command "gcloud run deploy spraydom-api --source . --allow-unauthenticated".

---