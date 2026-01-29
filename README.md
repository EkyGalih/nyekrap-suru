# 🎬 Drakor Scraping API (Next.js)

Drakor Scraping API adalah project berbasis **Next.js App Router** yang digunakan untuk melakukan scraping data drama dan film dari situs **Drakorkita**.

API ini menyediakan endpoint untuk:

- Homepage drama terbaru
- Daftar series (TV)
- Series ongoing & completed
- Daftar movie
- Pencarian drama/movie
- Genre list + filter genre
- Detail lengkap drama/movie

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/username/drakor-scraping-api.git
cd drakor-scraping-api
```

---

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

---

### 3. Setup Environment Variable

Buat file `.env.local`:

```env
PORT=3001
DRAKORKITA_URL=https://drakor99.kita.baby
```

---

### 4. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di:

```
http://localhost:3001
```

---

## 📖 Dokumentasi Swagger

API ini sudah dilengkapi dokumentasi Swagger UI.

Akses melalui:

```
http://localhost:3001/docs
```

atau endpoint JSON swagger:

```
http://localhost:3001/api/swagger
```

---

# 📌 Daftar Endpoint API

Semua endpoint berada di base URL:

```
http://localhost:3001/api
```

---

## 🔥 Homepage Drama Terbaru

### GET `/drakorkita/homepage`

Mengambil daftar drama terbaru yang tampil di homepage Drakorkita.

**Query Parameter:**

| Nama | Tipe   | Wajib | Contoh |
|------|--------|-------|--------|
| page | number | Tidak | 1      |

**Contoh Request:**

```bash
GET /api/drakorkita/homepage?page=1
```

---

## 📺 Semua Series

### GET `/drakorkita/series`

Mengambil semua drama series (TV).

**Query Parameter:**

| Nama | Tipe   | Wajib | Contoh |
|------|--------|-------|--------|
| page | number | Tidak | 1      |

**Contoh:**

```bash
GET /api/drakorkita/series?page=1
```

---

## ⏳ Series Ongoing

### GET `/drakorkita/series/ongoing`

Mengambil daftar drama series yang masih ongoing.

**Query Parameter:**

| Nama | Tipe   | Wajib | Contoh |
|------|--------|-------|--------|
| page | number | Tidak | 1      |

**Contoh:**

```bash
GET /api/drakorkita/series/ongoing?page=1
```

---

## ✅ Series Completed / Tamat

### GET `/drakorkita/series/completed`

Mengambil daftar drama series yang sudah tamat.

**Query Parameter:**

| Nama | Tipe   | Wajib | Contoh |
|------|--------|-------|--------|
| page | number | Tidak | 1      |

**Contoh:**

```bash
GET /api/drakorkita/series/completed?page=1
```

---

## 🎥 Semua Movie

### GET `/drakorkita/movie`

Mengambil daftar film/movie dari Drakorkita.

**Query Parameter:**

| Nama | Tipe   | Wajib | Contoh |
|------|--------|-------|--------|
| page | number | Tidak | 1      |

**Contoh:**

```bash
GET /api/drakorkita/movie?page=1
```

---

## 🔍 Search Drama / Movie

### GET `/drakorkita/search`

Melakukan pencarian drama/movie berdasarkan keyword.

**Query Parameter:**

| Nama | Tipe   | Wajib | Contoh     |
|------|--------|-------|------------|
| q    | string | Ya    | revenge    |
| page | number | Tidak | 1          |

**Contoh Request:**

```bash
GET /api/drakorkita/search?q=revenge&page=1
```

---

## 🏷️ Semua Genre

### GET `/drakorkita/genres`

Mengambil daftar genre yang tersedia di Drakorkita.

**Contoh:**

```bash
GET /api/drakorkita/genres
```

---

## 🎭 Drama Berdasarkan Genre

### GET `/drakorkita/genres/{endpoint}`

Mengambil daftar drama/movie berdasarkan genre tertentu.

**Path Parameter:**

| Nama     | Tipe   | Contoh   |
|----------|--------|----------|
| endpoint | string | history  |

**Query Parameter:**

| Nama | Tipe   | Wajib | Contoh |
|------|--------|-------|--------|
| page | number | Tidak | 1      |

**Contoh Request:**

```bash
GET /api/drakorkita/genres/history?page=1
```

---

## 📌 Detail Drama / Movie

### GET `/drakorkita/detail/{endpoint}`

Mengambil detail lengkap drama/movie berdasarkan slug endpoint.

**Path Parameter:**

| Nama     | Tipe   | Contoh                        |
|----------|--------|------------------------------|
| endpoint | string | alchemy-of-souls-2022-x9ab   |

**Contoh Request:**

```bash
GET /api/drakorkita/detail/alchemy-of-souls-2022-x9ab
```

---

# ⚙️ Tech Stack

- Next.js App Router
- TypeScript
- Axios
- Cheerio (Web Scraping)
- Swagger UI Documentation

---

# 📌 Catatan

Project ini dibuat untuk kebutuhan edukasi dan pembelajaran scraping API.

Gunakan dengan bijak sesuai aturan situs sumber.

---

# ✨ Author

Developed by **Suru Drakor API Project**
