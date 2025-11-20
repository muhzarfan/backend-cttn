# 📝 Backend Website Catatan

Backend Catatan adalah RESTful API sederhana untuk mengelola pengguna dan catatan. Proyek ini menyediakan fitur autentikasi (register, login, logout) serta CRUD untuk catatan.
Link website: [Emzar Catatan](https://emzar-catatanku.vercel.app/)

## Software yang Digunakan
- **Node.js**  
- **Express.js**  
- **Database** menggunakan MongoDB  

## Instalasi & Menjalankan Server

1. Clone repositori:
   ```bash
   git clone https://github.com/muhzarfan/backend-cttn.git
   cd backend-cttn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan server:
   ```bash
   npm start
   ```
   atau jika menggunakan nodemon:
   ```bash
   npm run dev
   ```

4. Server akan berjalan di:
   ```
   http://localhost:5000
   ```

---

## 🔑 Autentikasi
Sebagian besar endpoint membutuhkan **token JWT** yang diperoleh saat login. Token dikirimkan melalui header:

```
Authorization: Bearer <token>
```

---

## Dokumentasi Endpoint API

### 1. Register User
**Request**
```http
POST /auth/register
```
**Body**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "note": "Sesuai data register"
    },
  "expiresIn": "7d"
}
```

---

### 2. Login User
**Request**
```http
POST /auth/login
```
**Body**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "*Token untuk autentikasi*",
    "user": {
      "note": "Informasi login user"
    },
    "expiresIn": "7d"
  }
}
```

---

### 3. Logout User
**Request**
```http
POST /auth/logout
```

**Response**
```json
{
    "success": true,
    "message": "Logout berhasil, silakan hapus token di client"
}
```

---

### 4. Cek Profile yang Login
**Request**
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 5. Buat Note
**Request**
```http
POST /notes
Authorization: Bearer <token>
```
**Body**
```
{
  "title": "My New Note",
  "content": "Ini adalah isi catatan saya.",
  "tags": "#tag1 #tag2"
}
```

**Response**
```json
{
    "success": true,
    "message": "Note created successfully",
    "data": {
        "note": {
            "title": "My New Note",
            "content": "Ini adalah isi catatan saya.",
            "tags": "#tag1 #tag2",
            "username": "johndoe",
            "userId": "1",
            "_id": "1234567890",
            "createdAt": "29/9/2025",
            "updatedAt": "29/9/2025",
            "__v": 0
        }
    }
}
```

---

### 6. Cek Note berdasarkan ID
**Request**
```http
GET /notes/:id
Authorization: Bearer <token>
```

**Response**
```json
{
    "success": true,
    "data": {
        "note": {
            "_id": "1234567890",
            "title": "My New Note",
            "content": "Ini adalah isi catatan saya.",
            "tags": "#tag1 #tag2",
            "username": "johndoe",
            "userId": "1",
            "createdAt": "29/9/2025",
            "updatedAt": "29/9/2025",
            "__v": 0
        }
    }
}
```

---

### 7. Update Note
**Request**
```http
PUT /notes/:id
Authorization: Bearer <token>
```

**Body**
```json
{
  "title": "Updated Note Title",
  "content": "Updated content",
  "tags": "#updated #note"
}
```

**Response**
```json
{
    "success": true,
    "data": {
        "note": {
            "_id": "1234567890",
            "title": "My New Note",
            "content": "Ini adalah isi catatan saya.",
            "tags": "#tag1 #tag2",
            "username": "johndoe",
            "userId": "1",
            "createdAt": "29/9/2025",
            "updatedAt": "29/9/2025",
            "__v": 0
        }
    }
}
```

---

### 8. Hapus Note
**Request**
```http
DELETE /notes/:id
Authorization: Bearer <token>
```

**Response**
```json
{
    "success": true,
    "message": "Note deleted successfully"
}
```

---

### 9. Cek Status User Notes
**Request**
```http
GET /notes
Authorization: Bearer <token>
```

**Response**
```json
[
  {
      "success": true,
      "data": {
          "notes": [
              {
                  "_id": "68da0f11bc39bc76bc8d5b2d",
                  "title": "My New Note",
                  "content": "Ini adalah isi catatan saya.",
                  "tags": "#tag1 #tag2",
                  "username": "yoru",
                  "userId": "68d9fae8a2d14f4d83c5613d",
                  "createdAt": "29/9/2025",
                  "updatedAt": "29/9/2025",
                  "__v": 0
              },
              {
                  "_id": "68da0e2abc39bc76bc8d5b26",
                  "title": "My New Note",
                  "content": "Ini adalah isi catatan saya.",
                  "tags": "#tag1 #tag2",
                  "username": "yoru",
                  "userId": "68d9fae8a2d14f4d83c5613d",
                  "createdAt": "29/9/2025",
                  "updatedAt": "29/9/2025",
                  "__v": 0
              }
          ],
          "pagination": {
              "currentPage": 1,
              "totalPages": 1,
              "total": 2,
              "hasNextPage": false,
              "hasPrevPage": false
          }
      }
  }
]
```

---
