# 🚀 ConnectVista - Deployment Preparation Guide

## 📋 Overview
This guide provides step-by-step instructions for deploying ConnectVista to production environments. Follow these steps to ensure a smooth and successful deployment.

---

## 🎯 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All features tested and working
- [ ] No console errors in production build
- [ ] No commented-out code (cleanup)
- [ ] All debug logs removed
- [ ] Code formatted consistently
- [ ] ESLint warnings resolved
- [ ] Git repository clean (no uncommitted changes)

### ✅ Security
- [ ] All API keys moved to environment variables
- [ ] JWT secret changed to strong random string
- [ ] CORS configured for production domains
- [ ] Rate limiting configured
- [ ] Helmet.js security headers enabled
- [ ] Password requirements enforced
- [ ] File upload restrictions in place

### ✅ Performance
- [ ] Images optimized
- [ ] Database indexes created
- [ ] API pagination implemented
- [ ] Lazy loading configured (if applicable)
- [ ] Build minified and optimized

### ✅ Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Setup instructions clear
- [ ] User guide created (optional)

---

## 🗄️ Database Preparation

### MongoDB Atlas Setup

#### 1. Create MongoDB Atlas Account
- Visit: https://www.mongodb.com/cloud/atlas
- Sign up for free tier
- Create organization

#### 2. Create Cluster
```
1. Click "Build a Database"
2. Choose "Shared" (Free Tier) or paid tier
3. Select Cloud Provider: AWS/GCP/Azure
4. Choose Region: Closest to your users
5. Cluster Name: ConnectVista-Production
6. Click "Create Cluster"
```

#### 3. Configure Network Access
```
1. Go to "Network Access" tab
2. Click "Add IP Address"
3. Options:
   - Add Current IP (for development)
   - Allow Access from Anywhere: 0.0.0.0/0 (for production)
   - Or add specific server IPs
4. Save
```

#### 4. Create Database User
```
1. Go to "Database Access" tab
2. Click "Add New Database User"
3. Username: connectvista_admin
4. Password: Generate secure password (save this!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"
```

#### 5. Get Connection String
```
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js
4. Version: 4.1 or later
5. Copy connection string:
   mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/connectvista?retryWrites=true&w=majority
6. Replace <password> with your database user password
7. Replace database name (connectvista)
```

#### 6. Import Data (Optional)
If you have existing data:
```bash
# Export from local MongoDB
mongodump --db connectvista --out ./backup

# Import to Atlas (using mongorestore)
mongorestore --uri "mongodb+srv://username:password@cluster.xxxxx.mongodb.net" --db connectvista ./backup/connectvista
```

---

## 🔧 Environment Configuration

### Backend Environment Variables

Create `.env.production` file:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/connectvista?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_and_very_long_random_string_here_min_32_chars
JWT_EXPIRE=7d

# Frontend URLs (Update with your actual domains)
FRONTEND_URL=https://connectvista.com
ADMIN_URL=https://admin.connectvista.com

# Email Configuration (if using SMTP instead of EmailJS)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Payment Gateway (Add when implementing)
STRIPE_SECRET_KEY=sk_live_xxxxx
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Socket.IO
SOCKET_CORS_ORIGIN=https://connectvista.com,https://admin.connectvista.com
```

### Frontend Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.connectvista.com/api
VITE_SOCKET_URL=https://api.connectvista.com
VITE_ENVIRONMENT=production
```

### Admin Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.connectvista.com/api
VITE_SOCKET_URL=https://api.connectvista.com
VITE_ENVIRONMENT=production
```

---

## 🌐 Backend Deployment Options

### Option 1: Railway (Recommended - Easy)

#### Setup:
1. **Create Railway Account**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   ```
   1. Click "New Project"
   2. Choose "Deploy from GitHub repo"
   3. Select your ConnectVista repository
   4. Choose ConnectVista_Backend folder
   ```

3. **Configure Environment Variables**
   ```
   1. Go to project settings
   2. Click "Variables" tab
   3. Add all variables from .env.production
   4. Save
   ```

4. **Configure Start Command**
   ```
   Settings → Start Command: npm start
   ```

5. **Deploy**
   - Railway auto-deploys on git push
   - Get your deployment URL: `https://your-app.railway.app`

#### Custom Domain (Optional):
```
1. Settings → Domains
2. Click "Generate Domain" or "Custom Domain"
3. Add your domain: api.connectvista.com
4. Update DNS records (Railway provides instructions)
```

---

### Option 2: Heroku

#### Setup:
1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd ConnectVista_Backend
   heroku create connectvista-api
   ```

3. **Add MongoDB Add-on** (or use Atlas)
   ```bash
   # Using Atlas (recommended)
   heroku config:set MONGODB_URI="mongodb+srv://..."
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET="your-secret-here"
   heroku config:set FRONTEND_URL="https://connectvista.com"
   heroku config:set NODE_ENV="production"
   # ... add all other variables
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push heroku main
   ```

6. **Open App**
   ```bash
   heroku open
   ```

---

### Option 3: DigitalOcean App Platform

#### Setup:
1. **Create DigitalOcean Account**
   - Visit: https://www.digitalocean.com

2. **Create App**
   ```
   1. Go to Apps section
   2. Click "Create App"
   3. Connect GitHub repository
   4. Select ConnectVista_Backend folder
   ```

3. **Configure Build & Run**
   ```
   Build Command: npm install
   Run Command: npm start
   ```

4. **Add Environment Variables**
   - Add all variables from .env.production

5. **Deploy**
   - DigitalOcean builds and deploys automatically

---

### Option 4: VPS (AWS EC2, DigitalOcean Droplet, Linode)

#### Setup Ubuntu Server:

1. **Connect to Server**
   ```bash
   ssh root@your-server-ip
   ```

2. **Update System**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   node --version
   ```

4. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/your-username/ConnectVista.git
   cd ConnectVista/ConnectVista_Backend
   ```

6. **Install Dependencies**
   ```bash
   npm install --production
   ```

7. **Create .env File**
   ```bash
   nano .env
   # Paste your production environment variables
   # Save: Ctrl+X, Y, Enter
   ```

8. **Start with PM2**
   ```bash
   pm2 start server.js --name connectvista-api
   pm2 save
   pm2 startup
   ```

9. **Install Nginx (Reverse Proxy)**
   ```bash
   sudo apt install nginx -y
   ```

10. **Configure Nginx**
    ```bash
    sudo nano /etc/nginx/sites-available/connectvista
    ```

    Add:
    ```nginx
    server {
        listen 80;
        server_name api.connectvista.com;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

11. **Enable Site**
    ```bash
    sudo ln -s /etc/nginx/sites-available/connectvista /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

12. **Install SSL (Let's Encrypt)**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d api.connectvista.com
    ```

---

## 💻 Frontend Deployment Options

### Option 1: Vercel (Recommended - Easy)

#### Setup:
1. **Create Vercel Account**
   - Visit: https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   ```
   1. Click "New Project"
   2. Import ConnectVista repository
   3. Select ConnectVista_Frontend folder
   4. Framework Preset: Vite
   5. Root Directory: ConnectVista_Frontend
   ```

3. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   ```
   VITE_API_URL=https://api.connectvista.com/api
   VITE_SOCKET_URL=https://api.connectvista.com
   VITE_ENVIRONMENT=production
   ```

5. **Deploy**
   - Vercel auto-deploys
   - Get URL: `https://your-app.vercel.app`

6. **Custom Domain**
   ```
   1. Settings → Domains
   2. Add domain: connectvista.com
   3. Update DNS records (Vercel provides instructions)
   ```

---

### Option 2: Netlify

#### Setup:
1. **Create Netlify Account**
   - Visit: https://www.netlify.com

2. **Deploy from Git**
   ```
   1. Click "New site from Git"
   2. Connect to GitHub
   3. Select repository
   4. Base directory: ConnectVista_Frontend
   5. Build command: npm run build
   6. Publish directory: dist
   ```

3. **Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add all VITE_* variables

4. **Deploy**
   - Netlify builds automatically
   - Get URL: `https://your-app.netlify.app`

---

### Option 3: Build and Upload to Server

#### Build Locally:
```bash
cd ConnectVista_Frontend
npm run build
```

#### Upload to Server:
```bash
# Using SCP
scp -r dist/* user@server:/var/www/connectvista/

# Or use FTP client (FileZilla, Cyberduck)
```

#### Configure Nginx:
```nginx
server {
    listen 80;
    server_name connectvista.com;
    root /var/www/connectvista;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🛡️ Admin Panel Deployment

Same as Frontend deployment, but:
- Use `ConnectVista_Admin` folder
- Different domain: `admin.connectvista.com`
- Same environment variables

---

## 🔐 SSL Certificate Setup

### Option 1: Using Certbot (Free - Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d connectvista.com -d www.connectvista.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

### Option 2: Cloudflare (Free)

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS → Full (strict)
4. Automatic HTTPS rewrites: On

---

## 📊 Monitoring & Logging

### Setup PM2 Monitoring (for VPS)

```bash
# Install PM2 Plus (optional)
pm2 plus

# Monitor logs
pm2 logs connectvista-api

# Monitor resources
pm2 monit
```

### Error Tracking (Optional)

#### Sentry Integration:

1. **Sign up**: https://sentry.io
2. **Install SDK**:
   ```bash
   npm install @sentry/node
   ```
3. **Configure** in `server.js`:
   ```javascript
   const Sentry = require("@sentry/node");
   
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: process.env.NODE_ENV
   });
   ```

---

## 🔄 Continuous Deployment (CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        run: |
          # Railway CLI deploy command
          # Or trigger webhook
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
```

---

## 🧪 Post-Deployment Testing

### Smoke Tests:
- [ ] Homepage loads
- [ ] API health check: `https://api.connectvista.com/api/health`
- [ ] User can register/login
- [ ] Can create booking
- [ ] Real-time chat works
- [ ] Notifications appear
- [ ] Images upload successfully

### Performance Tests:
- [ ] Load time < 3 seconds
- [ ] API response time < 1 second
- [ ] No memory leaks
- [ ] Database queries optimized

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] Code tested thoroughly
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] CORS updated for production URLs
- [ ] API rate limiting enabled

### Deployment
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Admin panel deployed
- [ ] Database connected
- [ ] WebSocket connections working

### Post-Deployment
- [ ] All features tested in production
- [ ] Error monitoring active
- [ ] Logs being captured
- [ ] Backups scheduled
- [ ] CDN configured (optional)
- [ ] SEO metadata added
- [ ] Analytics setup (Google Analytics, etc.)

---

## 🔒 Security Hardening

### Backend:
- [ ] Environment variables not exposed
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] File upload restrictions
- [ ] Helmet.js security headers
- [ ] CORS whitelist only production domains

### Database:
- [ ] Strong admin password
- [ ] IP whitelist configured
- [ ] Regular backups enabled
- [ ] Encryption at rest enabled

### Frontend:
- [ ] No sensitive data in localStorage
- [ ] XSS protection
- [ ] Content Security Policy
- [ ] HTTPS only

---

## 💾 Backup Strategy

### Database Backups:

#### MongoDB Atlas (Automatic):
- Atlas provides automatic backups
- Configure retention period
- Test restore process

#### Manual Backup Script:
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"

mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

# Delete backups older than 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

Schedule with cron:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

---

## 📈 Scaling Considerations

### When to Scale:
- Response time > 3 seconds
- Database connections maxed out
- Server CPU > 80%
- Memory usage > 80%

### Vertical Scaling:
- Upgrade server plan (more CPU/RAM)
- Upgrade database tier

### Horizontal Scaling:
- Add load balancer
- Deploy multiple backend instances
- Use Redis for session management
- Implement caching (Redis, CDN)

---

## 🆘 Rollback Plan

### If Deployment Fails:

1. **Revert Git Commit**:
   ```bash
   git revert HEAD
   git push
   ```

2. **Restore Database** (if schema changed):
   ```bash
   mongorestore --uri="$MONGODB_URI" --db connectvista ./backup/latest
   ```

3. **Check Logs**:
   ```bash
   pm2 logs connectvista-api --lines 100
   ```

4. **Fix Issue** → Test → Redeploy

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **PM2 Docs**: https://pm2.keymetrics.io/docs
- **Nginx Docs**: https://nginx.org/en/docs

---

**Last Updated**: March 2026
**Version**: 1.0.0
