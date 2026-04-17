# TrustLock 🔐

A highly secure data sharing platform designed for maximum privacy, end-to-end encryption, and zero-knowledge architecture.

## Features
- **Zero-Knowledge Architecture:** Files are encrypted symmetrically in the browser using the Web Crypto API *before* upload. The server never sees your plaintext data or your encryption keys.
- **Secure File Sharing:** Generate secure links with granular permissions, passwords, and expiries.
- **Modern UI:** Built with React, Tailwind CSS, and Framer Motion.
- **Robust Backend:** Node.js, Express, MongoDB, and JWT Auth.

## Getting Started

### Using Docker (Recommended)
1. Ensure you have Docker and Docker Compose installed.
2. Run `docker-compose up --build`.
3. Open `http://localhost:5173` in your browser.

### Manual Setup
**Backend:**
1. `cd backend`
2. `npm install`
3. Ensure MongoDB is running locally on port 27017.
4. `npm run dev`

**Frontend:**
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Security Notes
- The decryption key is generated client-side and provided to the user. If the key is lost, the file **cannot be recovered**.
- Share links append the file ID, but the recipient still requires the base64 decryption key (provided by the sender out-of-band) to download the file.
