# HireWave Backend - Setup & Deployment Guide

## 📋 Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- MongoDB 7.0+ ([Download](https://www.mongodb.com/try/download/community))
- Docker & Docker Compose (optional)
- Git

## 🚀 Local Development Setup

### Step 1: Clone and Install

```bash
git clone https://github.com/yourusername/hirewave-backend.git
cd hirewave-backend
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hirewave
JWT_SECRET=your-secret-key-min-32-chars
CLIENT_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod --dbpath /path/to/data
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7.0
```

### Step 4: Start Backend

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 🐳 Docker Development

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

### Manual Docker

```bash
# Build image
docker build -t hirewave-backend .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongodb:27017/hirewave \
  -e JWT_SECRET=your-secret \
  hirewave-backend
```

## 🚀 Production Deployment

### 1. Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create hirewave-backend-prod

# Add MongoDB add-on
heroku addons:create mongolab

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set CLIENT_URL=https://yourdomain.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### 2. AWS Deployment

```bash
# Build Docker image
docker build -t 123456789.dkr.ecr.us-east-1.amazonaws.com/hirewave:latest .

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/hirewave:latest

# Deploy using ECS or EKS
```

### 3. DigitalOcean Deployment

```bash
# Create Dockerfile
# Push to Docker Hub
docker tag hirewave-backend yourusername/hirewave-backend:latest
docker push yourusername/hirewave-backend:latest

# Deploy on App Platform or Droplet
```

### 4. Railway.app Deployment

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV to production
- [ ] Configure CORS with specific origin
- [ ] Enable MongoDB authentication
- [ ] Setup email credentials
- [ ] Configure Cloudinary API keys
- [ ] Enable HTTPS
- [ ] Setup firewall rules
- [ ] Regular security audits
- [ ] Monitor error logs

## 📊 Database Setup

### MongoDB Atlas Cloud

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update MONGODB_URI in .env

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hirewave?retryWrites=true&w=majority
```

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

## 📈 Monitoring & Logging

### Application Logs

```bash
# Development
npm run dev

# Check logs
tail -f logs/app.log
```

### MongoDB Monitoring

```bash
# MongoDB Atlas
# - Charts
# - Real-time sync
# - Performance advisor

# Or use MongoDB Compass for local
```

## 🔄 CI/CD Setup

### GitHub Actions

1. Push code to GitHub
2. Workflow automatically runs tests
3. On success, can deploy to production
4. See `.github/workflows/backend-ci.yml`

### Required Secrets for Deployment

Add these in GitHub Settings > Secrets:

```
DEPLOY_HOST=your.server.com
DEPLOY_USER=deploy_user
DEPLOY_KEY=private_ssh_key
SLACK_WEBHOOK=https://hooks.slack.com/...
SONAR_TOKEN=sonarcloud_token
SNYK_TOKEN=snyk_token
```

## 🆘 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongo --version

# Test connection
mongosh "mongodb://localhost:27017"
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### npm Install Issues

```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

```bash
# Remove all containers
docker-compose down -v

# Rebuild
docker-compose up -d --build

# Check logs
docker-compose logs backend
```

## 📚 Resources

- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Docker Documentation](https://docs.docker.com)
- [JWT Documentation](https://jwt.io)

## 💬 Support

For issues:
1. Check error logs
2. Review documentation
3. Create GitHub issue
4. Contact support@hirewave.com

---

Happy deploying! 🚀
