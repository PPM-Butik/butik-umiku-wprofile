# Butik Umiku - Website Profile

Sebuah website profile modern untuk Butik Umiku yang dibangun menggunakan Next.js dengan desain yang responsif dan fitur-fitur lengkap.

## 🚀 Teknologi yang Digunakan

- **Framework**: Next.js 15.2.4
- **Runtime**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: NextAuth.js
- **Database**: MongoDB (Mongoose)
- **Form Handling**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Email**: Nodemailer

## 📋 Fitur Utama

- ✨ Desain modern dan responsif
- 🔐 Sistem autentikasi lengkap
- 📱 Mobile-first design
- 🎨 Dark/Light mode support
- 📊 Dashboard dengan charts
- 📧 Integrasi email
- 🎭 Animasi yang smooth
- 📝 Form validation yang robust
- 🎪 UI components yang kaya

## 🛠️ Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/PPM-Butik/butik-umiku-wprofile.git
   cd butik-umiku-wprofile
   ```

2. **Install dependencies**

   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Setup environment variables**

   Buat file `.env.local` di root directory dan tambahkan variabel berikut:

   ```env
    # NextAuth Configuration
    NEXTAUTH_URL=
    NEXTAUTH_SECRET=

    # Database
    MONGODB_URI=

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

    # Social Media Links
    NEXT_PUBLIC_WHATSAPP_URL=
    NEXT_PUBLIC_INSTAGRAM_URL=
    NEXT_PUBLIC_FACEBOOK_URL=
    NEXT_PUBLIC_TIKTOK_URL=
   ```

4. **Jalankan development server**

   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

5. **Buka aplikasi**

   Kunjungi url yang muncul di terminal.

## 📁 Struktur Project

```
butik-umiku-wprofile/
├── app/                    # App Router (Next.js 13+)
├── components/             # Reusable components
│   ├── ui/                # UI components (Radix + Tailwind)
│   └── ...
├── hooks/
├── lib/                   # Utility functions
├── public/                # Static assets
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
└── ...
```

## 🚀 Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Menjalankan production server
- `npm run lint` - Menjalankan ESLint

## 🎨 UI Components

Project ini menggunakan berbagai UI components dari Radix UI yang sudah dikustomisasi:

- Accordion, Alert Dialog, Avatar
- Button, Card, Checkbox
- Dialog, Dropdown Menu, Form
- Navigation Menu, Popover, Select
- Table, Tabs, Toast
- Dan masih banyak lagi...

## 🔧 Konfigurasi

### Database

Project ini menggunakan MongoDB dengan Mongoose sebagai ODM. Pastikan Anda memiliki koneksi MongoDB yang valid.

### Authentication

Menggunakan NextAuth.js untuk sistem autentikasi. Konfigurasi provider dan callback dapat disesuaikan di file konfigurasi NextAuth.

### Styling

- Tailwind CSS untuk utility-first styling
- Tailwind Animate untuk animasi
- Class Variance Authority untuk component variants

## 📱 Responsive Design

Website ini dioptimalkan untuk berbagai ukuran layar:

- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🌙 Dark Mode

Mendukung dark/light mode switching menggunakan next-themes dengan transisi yang smooth.

## 📊 Analytics & Charts

Terintegrasi dengan Recharts untuk visualisasi data yang menarik dan interaktif.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) untuk framework yang luar biasa
- [Tailwind CSS](https://tailwindcss.com/) untuk styling yang efisien
- [Radix UI](https://www.radix-ui.com/) untuk komponen UI yang accessible

---
