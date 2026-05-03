# AI-Home-Appliance-Recommender
AI-powered system that recommends home appliances based on user preferences like budget, usage, and energy efficiency. Built using React, Node.js, and deployed on cloud.
# ApplianceAI

A premium, full-stack web application that provides personalized home appliance recommendations using AI. Features a GitHub-inspired dark dashboard, authenticated user profiles, side-by-side spec comparison, and an interactive AI Chat Assistant.

![Dashboard Preview](placeholder.png)

## Tech Stack
| Tier | Technology |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS, Lucide React, Axios, React Router |
| **Backend** | Node.js, Express, SQLite, Groq SDK (LLaMA-3.3 70B), JWT |
| **Hosting (Recommended)** | Vercel (Frontend), Railway (Backend) |

## Local Setup

### 1. Backend Setup
1. Open terminal and navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Copy the environment file: `cp .env.example .env`
4. Add your API keys to `.env`:
   ```
   GROQ_API_KEY=your_groq_key
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   ```
5. Start the server: `npm run dev`

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Visit `http://localhost:5173`

## Public Deployment Guide

### Deploying the Backend (Railway)
1. Push your repository to GitHub.
2. Go to [Railway.app](https://railway.app), create a new project, and deploy from your GitHub repo.
3. Railway will automatically detect the `Procfile` (`web: node server.js`).
4. Go to **Variables** in Railway and add `GROQ_API_KEY` and `JWT_SECRET`.
5. Under Settings, click **Generate Domain**. Note this URL (e.g., `https://your-backend.up.railway.app`).

### Deploying the Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com), add a new project, and import your GitHub repo.
2. Set the Framework Preset to **Vite** and Root Directory to `frontend`.
3. Go to **Environment Variables** and add:
   - `VITE_API_URL`: The Railway domain you generated (e.g., `https://your-backend.up.railway.app`)
4. Click **Deploy**. Vercel will use the `vercel.json` automatically for routing.

### Custom Domain
To use a custom domain, simply add it in the Vercel dashboard under Settings > Domains. Update the CORS config in the backend `server.js` if you change the domain.
