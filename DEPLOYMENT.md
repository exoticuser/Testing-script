# Deployment Guide

This document provides detailed deployment instructions for StreamFlix on various platforms.

## Table of Contents

- [Vercel Deployment](#vercel-deployment)
- [Railway Deployment](#railway-deployment)
- [Render Deployment](#render-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Docker Deployment](#docker-deployment)
- [DigitalOcean App Platform](#digitalocean-app-platform)
- [AWS Deployment](#aws-deployment)
- [Google Cloud Platform](#google-cloud-platform)

## Vercel Deployment

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy backend:
```bash
cd backend
vercel
```

3. Deploy frontend:
```bash
cd ../frontend
vercel
```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Configure settings:
   - For backend: Set root directory to `backend`
   - For frontend: Set root directory to `frontend`
6. Add environment variables in project settings
7. Deploy

### Environment Variables for Vercel

**Backend:**
- `PORT=5000`
- `JWT_SECRET=your_strong_secret_here`
- `OMDB_API_KEY=your_omdb_api_key`

**Frontend:**
- `NEXT_PUBLIC_API_URL=https://your-backend.vercel.app`

## Railway Deployment

### Step-by-step Guide

1. Visit [Railway.app](https://railway.app) and sign up
2. Create a new project
3. Deploy backend:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set root directory: `backend`
   - Add environment variables
   - Deploy
4. Deploy frontend:
   - Add new service to same project
   - Select same repository
   - Set root directory: `frontend`
   - Add environment variable: `NEXT_PUBLIC_API_URL`
   - Deploy

### Railway Configuration

Create `railway.json` in backend directory:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Render Deployment

### Backend Deployment on Render

1. Sign up at [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** streamflix-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Add environment variables
6. Click "Create Web Service"

### Frontend Deployment on Render

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** streamflix-frontend
   - **Root Directory:** frontend
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Click "Create Web Service"

## Heroku Deployment

### Prerequisites
```bash
npm install -g heroku
heroku login
```

### Deploy Backend
```bash
cd backend
heroku create streamflix-backend
heroku config:set JWT_SECRET=your_strong_secret_here
heroku config:set OMDB_API_KEY=your_omdb_api_key
git subtree push --prefix backend heroku main
```

### Deploy Frontend
```bash
cd frontend
heroku create streamflix-frontend
heroku config:set NEXT_PUBLIC_API_URL=https://streamflix-backend.herokuapp.com
git subtree push --prefix frontend heroku main
```

### Heroku Procfile

Create `Procfile` in backend directory:
```
web: npm start
```

Create `Procfile` in frontend directory:
```
web: npm start
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

### Manual Docker Build

**Build Backend:**
```bash
cd backend
docker build -t streamflix-backend .
docker run -d -p 5000:5000 \
  -e JWT_SECRET=your_secret \
  -e OMDB_API_KEY=your_key \
  --name streamflix-backend \
  streamflix-backend
```

**Build Frontend:**
```bash
cd frontend
docker build -t streamflix-frontend .
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://backend:5000 \
  --name streamflix-frontend \
  streamflix-frontend
```

### Docker Hub Deployment

1. Build and tag images:
```bash
docker build -t yourusername/streamflix-backend:latest ./backend
docker build -t yourusername/streamflix-frontend:latest ./frontend
```

2. Push to Docker Hub:
```bash
docker push yourusername/streamflix-backend:latest
docker push yourusername/streamflix-frontend:latest
```

3. Pull and run on any server:
```bash
docker pull yourusername/streamflix-backend:latest
docker pull yourusername/streamflix-frontend:latest
docker-compose up -d
```

## DigitalOcean App Platform

### Deploy via DigitalOcean UI

1. Sign up at [DigitalOcean](https://www.digitalocean.com)
2. Go to App Platform
3. Create new app
4. Connect GitHub repository
5. Configure services:

**Backend Service:**
- Type: Web Service
- Source Directory: backend
- Build Command: `npm install`
- Run Command: `npm start`
- HTTP Port: 5000

**Frontend Service:**
- Type: Web Service
- Source Directory: frontend
- Build Command: `npm install && npm run build`
- Run Command: `npm start`
- HTTP Port: 3000

6. Add environment variables
7. Deploy

### DigitalOcean App Spec

Create `.do/app.yaml`:
```yaml
name: streamflix
services:
  - name: backend
    source_dir: backend
    environment_slug: node-js
    run_command: npm start
    build_command: npm install
    envs:
      - key: PORT
        value: "5000"
      - key: JWT_SECRET
        type: SECRET
      - key: OMDB_API_KEY
        type: SECRET
  - name: frontend
    source_dir: frontend
    environment_slug: node-js
    run_command: npm start
    build_command: npm install && npm run build
    envs:
      - key: NEXT_PUBLIC_API_URL
        value: ${backend.PUBLIC_URL}
```

## AWS Deployment

### Deploy on AWS Elastic Beanstalk

1. Install AWS CLI and EB CLI:
```bash
pip install awscli awsebcli
```

2. Configure AWS credentials:
```bash
aws configure
```

3. Initialize Elastic Beanstalk:
```bash
cd backend
eb init -p node.js streamflix-backend
eb create streamflix-backend-env
```

4. Deploy:
```bash
eb deploy
```

### Deploy on AWS EC2

1. Launch EC2 instance (Ubuntu)
2. SSH into instance
3. Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone repository:
```bash
git clone https://github.com/exoticuser/Testing-script.git
cd Testing-script
```

5. Install dependencies:
```bash
npm run install:all
```

6. Set up environment variables:
```bash
cd backend
cp .env.example .env
nano .env  # Edit variables
```

7. Install PM2:
```bash
sudo npm install -g pm2
```

8. Start services:
```bash
cd backend
pm2 start src/index.js --name streamflix-backend

cd ../frontend
pm2 start npm --name streamflix-frontend -- start
```

9. Set up PM2 to start on boot:
```bash
pm2 startup
pm2 save
```

## Google Cloud Platform

### Deploy on Google App Engine

1. Install Google Cloud SDK
2. Create `app.yaml` in backend directory:
```yaml
runtime: nodejs18
env: standard
instance_class: F1

env_variables:
  PORT: "5000"
  JWT_SECRET: "your_secret"
  OMDB_API_KEY: "your_key"

handlers:
- url: /.*
  script: auto
```

3. Deploy backend:
```bash
cd backend
gcloud app deploy
```

4. Create `app.yaml` in frontend directory and deploy similarly

### Deploy on Google Cloud Run

1. Build container images:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/streamflix-backend ./backend
gcloud builds submit --tag gcr.io/PROJECT_ID/streamflix-frontend ./frontend
```

2. Deploy services:
```bash
gcloud run deploy streamflix-backend \
  --image gcr.io/PROJECT_ID/streamflix-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy streamflix-frontend \
  --image gcr.io/PROJECT_ID/streamflix-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Environment Variables Reference

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port |
| JWT_SECRET | Yes | - | Secret key for JWT tokens |
| OMDB_API_KEY | No | trilogy | OMDb API key for movie data |
| NODE_ENV | No | development | Environment mode |

### Frontend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | Yes | http://localhost:5000 | Backend API URL |

## Post-Deployment Checklist

- [ ] Verify both services are running
- [ ] Test API health endpoint: `GET /api/health`
- [ ] Test frontend access
- [ ] Change default admin credentials
- [ ] Verify CORS settings
- [ ] Check environment variables are set correctly
- [ ] Test login functionality
- [ ] Test movie CRUD operations
- [ ] Set up database backups
- [ ] Configure custom domain (optional)
- [ ] Set up SSL/HTTPS
- [ ] Monitor application logs
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure CDN for static assets (optional)

## Troubleshooting Common Issues

### Backend won't start
- Check environment variables are set
- Verify Node.js version compatibility
- Check logs for error messages
- Ensure database directory exists and has write permissions

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend is accessible from frontend

### Database issues
- Verify SQLite database file permissions
- Check database directory exists
- Consider using managed database for production

### Build failures
- Clear cache and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`
- Verify all dependencies are compatible

## Performance Optimization

1. **Enable caching:**
   - Use Redis for session storage
   - Implement HTTP caching headers

2. **Use CDN:**
   - Serve static assets via CDN
   - Enable Vercel Edge Network for Next.js

3. **Database optimization:**
   - Add database indexes
   - Consider database connection pooling
   - Migrate to PostgreSQL for larger scale

4. **Monitoring:**
   - Set up application monitoring (New Relic, Datadog)
   - Configure error tracking (Sentry)
   - Monitor server resources

## Support

For deployment issues:
- Check platform-specific documentation
- Review application logs
- Open an issue on GitHub
- Consult platform support channels
