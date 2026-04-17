# TrustLock Deployment Guide 🚀

This project is now "Deployment Ready". Follow these steps to host it for free.

## 1. Database (MongoDB Atlas)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a free shared cluster (M0).
3. Under "Network Access", allow access from `0.0.0.0/0` (required for Render/Vercel).
4. Get your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/trustlock`.

## 2. Backend (Render)
1. Create a free account at [Render.com](https://render.com).
2. Create a new **Web Service**.
3. Link your GitHub repository.
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
5. **Environment Variables**:
   - `MONGO_URI`: (Your MongoDB Atlas string)
   - `JWT_SECRET`: (Any long random string)
   - `PORT`: `10000`

## 3. Frontend (Vercel)
1. Create a free account at [Vercel.com](https://vercel.com).
2. Create a new Project and link your GitHub repository.
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
4. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-name.onrender.com/api`

---

## Technical Changes Made for Deployment:
- **`backend/src/config/db.ts`**: Updated to automatically switch between your live MongoDB Atlas and the local memory server.
- **`frontend/src/api.ts`**: Configured to use the production URL when deployed.
- **`backend/package.json`**: Verified build and start scripts.
