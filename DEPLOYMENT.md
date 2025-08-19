# 🚀 Deployment Guide - Rustin's Secret Game

## Overview
This guide covers deploying the Secret Game to production with multiple hosting options, from simple to advanced.

## 📦 Frontend Deployment Options

### Option 1: Vercel (Recommended - Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**⚠️ CRITICAL: Get the Correct PUBLIC URL**
After deployment, get the production URL that players can access:
```bash
# Get the actual production URL (PUBLIC)
vercel project ls
# Use the URL from "Latest Production URL" column
# Format: https://project-name-username-team.vercel.app
```

**❌ DON'T use deployment-specific URLs** (these may require login):
- `https://project-abc123-username.vercel.app` ← Wrong (login required)

**✅ DO use the project production URL**:
- `https://project-name-username-team.vercel.app` ← Correct (public access)

**This distinction is CRITICAL for party games** - wrong URL = all players need Vercel login!

**Configuration**: Add `vercel.json` to frontend directory:
```json
{
  "framework": "create-react-app", 
  "buildCommand": "npm run build",
  "outputDirectory": "build"
}
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy frontend
cd frontend
npm run build
netlify deploy --prod --dir=build
```

**Configuration**: Add `netlify.toml` to frontend directory:
```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  REACT_APP_BACKEND_URL = "https://your-backend-url.com"
```

### Option 3: GitHub Pages
```bash
# Install gh-pages
cd frontend
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

npm run deploy
```

## 🖥️ Backend Deployment Options

### Option 1: Railway (Recommended - Easiest)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up
```

**Configuration**: Add `railway.toml` to backend directory:
```toml
[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "npm start"

[environments.production.variables]
  NODE_ENV = "production"
  PORT = "3001"
```

### Option 2: Heroku
```bash
# Install Heroku CLI
# Create Procfile in backend directory:
echo "web: npm start" > backend/Procfile

# Deploy
cd backend
heroku create rustin-secret-game-backend
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 3: DigitalOcean App Platform
```yaml
# Add .do/app.yaml to backend directory:
name: rustin-secret-game-backend
services:
- name: backend
  source_dir: /
  github:
    repo: your-username/secret_game
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: PORT
    value: "8080"
```

## 🔧 Configuration Setup

### 1. Update Frontend for Production
Add to `frontend/src/services/SocketService.ts`:

```typescript
const getBackendUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_BACKEND_URL || 'wss://your-backend-url.com';
  }
  return 'http://localhost:3001';
};

// Update socket connection
this.socket = io(getBackendUrl(), {
  autoConnect: true,
  transports: ['websocket', 'polling']
});
```

### 2. Update Backend for Production
Add to `backend/src/index.ts`:

```typescript
// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-frontend-domain.vercel.app',
        'https://your-frontend-domain.netlify.app',
        'https://your-custom-domain.com'
      ] 
    : ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
};
```

## 🌍 Custom Domain Setup

### Frontend (Vercel)
```bash
# Add custom domain
vercel domains add yourdomain.com
vercel alias your-deployment-url.vercel.app yourdomain.com
```

### Backend (Railway)
```bash
# Add custom domain
railway domain
# Follow prompts to add custom domain
```

## 📱 Mobile-Optimized Deployment

### PWA Configuration
Add to `frontend/public/manifest.json`:
```json
{
  "name": "Rustin's Secret Game",
  "short_name": "Secret Game",
  "description": "Golden Gate Park Hunt Game",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#4ECDC4",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔒 Environment Variables

### Frontend (.env.production)
```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
REACT_APP_GAME_NAME="Rustin's Secret Game"
REACT_APP_ENABLE_DEBUG=false
```

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
FRONTEND_URLS=https://your-frontend-url.com,https://yourdomain.com
MAX_PLAYERS_PER_SESSION=50
SESSION_CLEANUP_INTERVAL=300000
```

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Update backend CORS origins for your frontend domain
- [ ] Set production environment variables
- [ ] Test locally with production build (`npm run build`)
- [ ] Update WebSocket URL in frontend for production

### Post-Deployment
- [ ] Test game creation and joining
- [ ] Test multi-session functionality
- [ ] Test mobile responsiveness
- [ ] Verify WebSocket connections work
- [ ] Test with multiple players
- [ ] Monitor error logs

## 🚨 Quick Production Deploy (5 minutes)

For fastest deployment using recommended services:

```bash
# 1. Deploy Backend to Railway
cd backend
npx @railway/cli login
npx @railway/cli init
npx @railway/cli up

# 2. Get your backend URL from Railway dashboard
# 3. Update frontend environment
cd ../frontend
echo "REACT_APP_BACKEND_URL=https://your-railway-url.railway.app" > .env.production

# 4. Deploy Frontend to Vercel
npx vercel --prod

# 5. Done! Share your Vercel URL with players
```

## 🔧 Troubleshooting

### Common Issues
1. **WebSocket connection fails**: Check CORS settings and protocol (ws/wss)
2. **Players can't join**: Verify backend is running and accessible
3. **Session codes don't work**: Check if sessions are isolated properly
4. **Mobile interface issues**: Test responsive design and touch targets

### Monitoring
- Use service dashboards (Vercel, Railway) to monitor uptime
- Check browser console for frontend errors
- Monitor backend logs for WebSocket connection issues
- Set up simple health check endpoints

---

🎉 **Ready for Golden Gate Park!** Share your deployed game URL and let the hunt begin! 