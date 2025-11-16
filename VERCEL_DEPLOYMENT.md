# 🚀 Vercel Deployment Guide

Complete guide to deploying VCET Alumni Hub on Vercel's serverless platform.

## 📋 Prerequisites

- GitHub account with this repository
- Vercel account (free tier available at https://vercel.com)
- Cloud MySQL database (see Database Options below)

## 🗄️ Database Options

Since Vercel is serverless, you need a cloud MySQL database. Choose one:

### Option 1: PlanetScale (Recommended for Vercel) ⭐
- **Free Tier**: 5GB storage, 1 billion row reads/month
- **Serverless**: Perfect for Vercel
- **Sign up**: https://planetscale.com
- **Setup**:
  1. Create account
  2. Create database: `vcet_alumni_hub`
  3. Import your SQL file via CLI or dashboard
  4. Get connection string

### Option 2: Railway
- **Free Tier**: $5 credit monthly
- **Easy Setup**: One-click MySQL
- **Sign up**: https://railway.app
- **Setup**:
  1. Create project
  2. Add MySQL service
  3. Import SQL file
  4. Get connection credentials

### Option 3: AWS RDS Free Tier
- **Free Tier**: 750 hours/month for 12 months
- **Production Ready**: Enterprise grade
- **Setup**: More complex, see AWS documentation

### Option 4: DigitalOcean Managed MySQL
- **Cost**: Starting at $15/month
- **No Free Tier**: But reliable and fast
- **Setup**: Create managed database via dashboard

## 🚀 Deployment Steps

### Step 1: Prepare Database (15 minutes)

1. **Choose a database provider** from options above
2. **Create database** named `vcet_alumni_hub`
3. **Import database**:
   ```bash
   # For PlanetScale
   pscale shell vcet-alumni-hub main < database-export.sql
   
   # For Railway/Others
   mysql -h HOST -u USER -p DATABASE < database-export.sql
   ```
4. **Save credentials**: You'll need these for Vercel

### Step 2: Push to GitHub (if not already done)

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 3: Deploy to Vercel (5 minutes)

1. **Go to Vercel**: https://vercel.com
2. **Click "Add New Project"**
3. **Import from GitHub**:
   - Connect your GitHub account
   - Select repository: `vcetalumni`
   - Click "Import"
4. **Configure Project**:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

### Step 4: Configure Environment Variables (10 minutes)

In Vercel project settings, add these environment variables:

#### Required Variables:

```env
# Database Configuration
DB_HOST=your-database-host.com
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=vcet_alumni_hub
DB_PORT=3306
DB_CONNECTION_LIMIT=10

# Security (Generate random strings)
SESSION_SECRET=your-random-session-secret-min-32-chars
JWT_SECRET=your-random-jwt-secret-min-32-chars

# Application
NODE_ENV=production
APP_NAME=VCET Alumni Hub
BASE_URL=https://your-app.vercel.app
SESSION_MAX_AGE=86400000
MAX_FILE_SIZE=5242880
BCRYPT_ROUNDS=10
```

#### Generate Secrets:
```bash
# Generate SESSION_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

### Step 5: Deploy

1. **Click "Deploy"**
2. **Wait for build** (2-3 minutes)
3. **Copy your URL**: `https://your-app.vercel.app`
4. **Update BASE_URL**:
   - Go to Settings → Environment Variables
   - Update `BASE_URL` with your Vercel URL
   - Redeploy

### Step 6: Test Your Application

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Login works with demo accounts
- ✅ Dashboard accessible
- ✅ Profile viewing works
- ✅ Alumni directory functions

#### Demo Accounts:
- Admin: `admin@vcet.edu` / `password`
- Alumni: `rajesh.kumar@gmail.com` / `password`
- Student: `student1@vcet.edu` / `password`

## ⚠️ Important Notes

### File Uploads
- **Issue**: Vercel serverless functions have ephemeral storage
- **Impact**: Uploaded files are lost on redeployment
- **Solutions**:
  1. **Use Cloudinary** (recommended):
     - Sign up: https://cloudinary.com (free 25GB)
     - Add env variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
     - Update upload middleware to use Cloudinary
  2. **Use AWS S3**:
     - Configure S3 bucket
     - Update upload middleware
  3. **Accept temporary uploads**: Warn users files may be lost

### Session Storage
- **Current**: In-memory sessions (lost on serverless function restarts)
- **Impact**: Users logged out when function cold starts
- **Solution**: Consider using Redis or database-backed sessions for production

### Cold Starts
- **Free Tier**: Functions sleep after inactivity
- **Impact**: First request after sleep is slower (~2-5 seconds)
- **Solution**: Upgrade to Pro plan or implement keep-alive ping

## 🔧 Troubleshooting

### "Internal Server Error"
**Check**:
1. Environment variables are set correctly
2. Database is accessible and credentials are correct
3. Check Vercel deployment logs: Dashboard → Deployments → [latest] → View Function Logs

### "Cannot connect to database"
**Solutions**:
- Verify DB_HOST, DB_USER, DB_PASSWORD are correct
- Check database allows connections from external IPs
- For PlanetScale, make sure you're using the correct connection string format

### "Session not persisting"
**Normal**: With in-memory sessions, users may be logged out on cold starts
**Fix**: Implement database or Redis session store

### "Uploaded files disappear"
**Expected**: Vercel has ephemeral storage
**Fix**: Implement Cloudinary or S3 for persistent storage

## 📊 Performance Optimization

1. **Enable Compression**: Already configured in server.js
2. **Use CDN**: Vercel automatically uses edge network
3. **Database Connection Pool**: Configured in config/database.js
4. **Static Assets**: Served via Vercel Edge Network

## 🔄 Continuous Deployment

**Auto-deploy is enabled by default**:
- Every push to `main` branch triggers deployment
- Pull requests get preview deployments
- View status in Vercel dashboard

## 💰 Pricing

### Vercel Free Tier:
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ SSL included
- ✅ Custom domains
- ⚠️ Serverless function execution limit: 100GB-hours/month
- ⚠️ Functions sleep after inactivity (cold starts)

### Database Costs:
- PlanetScale: Free 5GB
- Railway: $5/month credit (free tier)
- Others: Variable

## 🔐 Security Checklist

- [x] Environment variables stored securely in Vercel
- [x] HTTPS enabled by default
- [x] Session secrets are strong random strings
- [x] Database credentials not in code
- [ ] Enable CSRF protection (optional)
- [ ] Set up rate limiting (optional)
- [ ] Configure CORS if needed (optional)

## 📈 Monitoring

**Vercel Dashboard provides**:
- Real-time deployment status
- Function logs
- Analytics (visits, performance)
- Error tracking

## 🆘 Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: support@vercel.com
- **GitHub Issues**: Report issues in this repository
- **Community**: https://github.com/vercel/vercel/discussions

## 🎉 Success!

Your VCET Alumni Hub is now live on Vercel! 🚀

**Next Steps**:
1. Set up custom domain (optional)
2. Configure Cloudinary for file uploads
3. Implement Redis sessions for better persistence
4. Set up monitoring and alerts
5. Add email notifications
6. Enable rate limiting

---

**Made with ❤️ for VCET Community**
