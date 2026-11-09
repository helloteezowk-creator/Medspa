# Lumina Medical Spa — Luxury Aesthetic Clinic Website

A production-grade, responsive website for Lumina Medical Spa, built with React, Vite, Tailwind CSS, Motion animations, and Supabase database integration.

---

## ⚠️ CRITICAL SECURITY WARNING & CREDENTIAL ROTATION NOTICE

> **ACTION REQUIRED BEFORE DEPLOYING TO PRODUCTION:**
>
> If this repository or any prior commit contains previously hardcoded credentials (such as your Supabase Project ID or Supabase Anon/Publishable Key), **those values remain permanently in Git commit history** even after being removed from the current working tree.
>
> ### Mandatory Rotation Steps:
> 1. Log in to your **[Supabase Dashboard](https://supabase.com/dashboard/)**.
> 2. Navigate to **Project Settings** $\rightarrow$ **API**.
> 3. Under **Project API keys**, click **Rotate / Reset Key** for your Anon key (or regenerate the JWT secret if needed).
> 4. Copy your newly generated Anon key.
> 5. Place the new key in your local `.env` file (which is gitignored) and your production hosting environment variables.
> 6. **Verify Row Level Security (RLS):** Ensure RLS is enabled on all tables (`appointments`, `admin_accounts`). Run `/supabase/schema.sql` in the Supabase SQL Editor.
> 7. **NEVER expose the `service_role` key:** The service role key bypasses all RLS and must NEVER be placed in client-side code, `.env`, or frontend bundles.

---

## Environment Variables Configuration

This project reads all runtime credentials exclusively from environment variables using the `VITE_` prefix.

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Populate `.env` with your actual credentials:
```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key-here"
```

### Secret Safety Rules Enforced in this Codebase:
1. **Zero Hardcoded Secrets:** No API keys, passwords, database connection strings, or project IDs exist as string literals in source code, utility files, or SQL comments.
2. **Strict Gitignoring:** `.env`, `.env.local`, and all `.env*.local` files are ignored by `.gitignore`.
3. **No Sensitive Frontend Exposure:** No private keys (Stripe secret keys, database connection strings, OAuth secrets, or Supabase `service_role` keys) are prefixed with `VITE_` or included in frontend client bundles.
4. **Credential Hashing:** Local admin authentication uses browser-native Web Crypto SHA-256 hashing. Passwords are never stored in active session storage.
5. **Sanitized Logs:** Console and error handlers never print passwords, tokens, or raw request credentials.

---

## Features

- **Luxury Aesthetic Design:** Cormorant Garamond display typography, Plus Jakarta Sans body, and warm porcelain canvas (`#FAF8F5`).
- **Medical Equipment Showcase:** Interactive 3D carousel with InfraBaldan 3.0™ infrared slimming pod, TriLaser™ platform, and FibraDFA™ Cryo-RF tower.
- **Treatment Menu & Calculator:** 14 aesthetic procedures with real-time protocol pricing calculator and financing estimates.
- **Direct Supabase Integration:** Client appointment requests are saved in real time with reference IDs.
- **Single-Slot Admin Portal:** Discreet administrative access strictly in the footer with live appointment filtering, status management, and CSV export.
- **Motion Animations:** Silk intro preloader, staggered scroll reveals, and interactive micro-animations.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the app.

### Production Build
```bash
npm run build
```
Builds the static application to the `dist/` directory.

---

## Deploying to Hostinger (or Any Static Web Host)

1. Build the production package:
   ```bash
   npm run build
   ```
2. In your Hostinger hPanel, open **File Manager** $\rightarrow$ **`public_html`**.
3. Upload and extract the generated **`lumina-website-hostinger.zip`** (or copy the contents of `dist/` directly into `public_html`).
4. Ensure `.htaccess`, `index.html`, and `assets/` reside directly in `public_html`.
5. Visit your domain — the site connects directly to Supabase via client API.
