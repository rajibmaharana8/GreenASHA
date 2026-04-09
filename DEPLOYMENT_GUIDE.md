# GreenASHA Deployment Guide

This document outlines the steps to deploy the **GreenASHA** project.

## Project Structure
- **Frontend**: `biochar/frontend` (React + Vite)
- **Backend**: `biochar/backend` (Node.js + Express)

---

## 1. Deploying the Backend (Render)

Render is recommended for hosting the Node.js Express server.

### Steps:
1. **Sign Up**: Create an account on [Render](https://render.com).
2. **New Web Service**: Click **New +** > **Web Service**.
3. **Connect Repository**: Connect your GitHub/GitLab account and select the `GreenASHA` repository.
4. **Configuration**:
   - **Name**: `greenasha-backend`
   - **Root Directory**: `biochar/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Environment Variables**:
   - Go to the **Environment** tab.
   - Add `PORT` (Render sets this automatically, but you can specify `5000`).
   - Add any other variables from your backend `.env`.
6. **Deploy**: Render will build and deploy your service.
7. **Get URL**: Copy the provided URL (e.g., `https://greenasha-backend.onrender.com`).

---

## 2. Deploying the Frontend (Vercel)

Vercel is the best platform for the Vite-based React frontend.

### Steps:
1. **Sign Up**: Create an account on [Vercel](https://vercel.com).
2. **New Project**: Click **Add New** > **Project**.
3. **Import**: Import your `GreenASHA` repository.
4. **Configuration**:
   - **Framework Preset**: `Vite`.
   - **Root Directory**: Click **Edit** and select `biochar/frontend`.
5. **Build & Output Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Environment Variables**:
   - Add a variable `VITE_API_URL` and set it to your Render backend URL.
7. **Deploy**: Click **Deploy**.

---

## 3. Post-Deployment Tips

### CORS Issues
If your frontend fails to call the backend, ensure the backend allows requests from your Vercel domain. In `biochar/backend/index.js`, update the CORS config:

```javascript
app.use(cors({
  origin: ['https://your-vercel-app-name.vercel.app', 'http://localhost:5173']
}));
```

### Static vs. Dynamic
Currently, your ROI Calculator in `App.jsx` uses local logic. If you want it to use the backend `api/calculate-roi` endpoint, you will need to update `App.jsx` to perform a `fetch()` call.
