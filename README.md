# 🤖 Vision Voice AI (v1.0.0)

**Vision Voice AI** adalah aplikasi web interaktif 3D Avatar AI modern dengan kemampuan percakapan suara *real-time*, didukung oleh **KoboiLLM (Gemini 3 Flash & Gemini 2.5 TTS)** dan teknologi render **VRM 3D Avatar (Three.js)**.

Aplikasi ini dilengkapi dengan fitur unggulan **Auto Listener (Gemini Live Mode)** yang memungkinkan Anda berinteraksi dan ngobrol panjang secara *hands-free* tanpa perlu menekan tombol mic berulang kali.

---

## ✨ Fitur Utama

- 🎙️ **Auto Listener (Gemini Live Voice Mode)**:
  - Perekaman suara *hands-free* secara terus-menerus (*continuous speech recognition*).
  - **Voice Activity Detection (VAD)**: Mengirimkan ucapan secara alami setelah 1.8 detik hening.
  - **Auto Mute & Unmute**: Microphone otomatis mati saat karakter bersuara dan otomatis aktif kembali saat karakter hening.
  - **Filter Gema Cerdas (*Strict Mid-Sentence Echo Stripping*)**: Membuang gema suara speaker karakter tanpa memotong balasan asli dari pengguna.
  - **Notifikasi Turn Status**: Badge visual berpendar + **nada chime audio sci-fi** sebagai penanda giliran bicara.
- 🧠 **AI Chat Model**: Diotaki oleh **Gemini 3 Flash Preview** (`gemini/gemini-3-flash-preview`) via KoboiLLM API.
- 🗣️ **AI Text-to-Speech (TTS)**: Suara pria konsisten Gemini (`gemini-2.5-flash-tts` dengan voice `Puck`).
- 🎭 **VRM 3D Avatar & Expression**: Render avatar 3D interaktif dengan ekspresi wajah & *lip-sync* otomatis berbasis Web Audio API.
- 🎨 **Futuristic UI/UX Design**: Desain antarmuka stealth dark mode beraksen crimson, glassmorphism, dan responsif.
- 🌐 **cPanel Deployment Ready**: Dilengkapi dengan file `server.js` untuk kemudahan *deployment* ke hosting cPanel Node.js.

---

## 🛠️ Teknologi Yang Digunakan

- **Frontend & Framework**: [Next.js](https://nextjs.org/) (React, TypeScript, Tailwind CSS)
- **3D Engine**: Three.js & [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)
- **Speech Recognition**: Web Speech API (`id-ID`)
- **LLM Provider**: KoboiLLM Open-AI Compatible Endpoint (`/v1/chat/completions`)
- **TTS Provider**: KoboiLLM Audio Speech Endpoint (`/v1/audio/speech`)

---

## 🚀 Cara Menjalankan di Lokal (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/andreyansyah/vision-voice-ai.git
cd vision-voice-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables (`.env.local`)
Buat file `.env.local` di folder root project:
```env
KOBOI_API_KEY=sk-LIyUDxzxPYUgj61n07NAig
```

### 4. Jalankan Server Pengembang
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📦 Deployment ke cPanel Hosting

Project ini dilengkapi dengan **`server.js`** untuk kemudahan *deploy* ke hosting cPanel:

1. Build project:
   ```bash
   npm run build
   ```
2. Compress seluruh folder project menjadi `project.zip` (termasuk `node_modules`, `.next`, `server.js`, dan `public/`).
3. Masuk ke cPanel ➔ **Setup Node.js App** ➔ Buat aplikasi dengan *Startup File*: `server.js`.
4. Extract `project.zip` di cPanel, masukkan `KOBOI_API_KEY` pada *Environment Variables*, lalu klik **Restart Application**.

---

## 📄 Lisensi & Kredit

- Base 3D VRM Viewer berbasis [ChatVRM](https://github.com/pixiv/ChatVRM) oleh pixiv Inc.
- AI Chat & TTS diproyeksikan menggunakan KoboiLLM Platform.

Developed with ❤️ by **Muhamad Andreyansyah**.
