# 📋 RENDER DEPLOYMENT GUIDE - VCET Alumni Hub

## 🎯 Prerequisites
- GitHub account
- Render account (free): https://render.com/
- Your code pushed to GitHub

---

## 📦 STEP 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/alumnihub-nodejs
git init
git add .
git commit -m "Initial commit - VCET Alumni Hub Node.js"
```

### 1.2 Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/vcet-alumni-hub.git
git branch -M main
git push -u origin main
```

---

## 🗄️ STEP 2: Create MySQL Database on Render

### 2.1 Go to Render Dashboard
- Visit: https://dashboard.render.com/
- Click **"New +"** → **"MySQL"**

### 2.2 Configure Database
```
Name: vcet-alumni-hub-db
Database: vcet_alumni_hub
User: [auto-generated]
Region: Oregon (US West)
Plan: Free
```

### 2.3 Click "Create Database"
- Wait 2-3 minutes for provisioning
- Copy these values (you'll need them):
  ✅ **Hostname** (Internal)
  ✅ **Port** (usually 3306)
  ✅ **Database Name**
  ✅ **Username**
  ✅ **Password**

### 2.4 Import Your Database Schema

#### Option A: Using MySQL Workbench
1. Connect to Render MySQL using the credentials
2. Import `/database.sql` from your local project

#### Option B: Using Command Line
```bash
# Export your local database first
/Applications/XAMPP/xamppfiles/bin/mysqldump -u root vcet_alumni_hub > database.sql

# Import to Render (replace with your credentials)
mysql -h [RENDER_HOST] -P 3306 -u [USERNAME] -p[PASSWORD] vcet_alumni_hub < database.sql
```

#### Option C: Use Render Console
1. In Render MySQL dashboard, click **"Connect"**
2. Use the Shell to run SQL commands
3. Copy-paste your SQL schema

---

## 🚀 STEP 3: Deploy Web Service on Render

### 3.1 Create Web Service
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository
- Select: `vcet-alumni-hub` (or your repo name)

### 3.2 Configure Service

**Basic Settings:**
```
Name: vcet-alumni-hub
Region: Oregon (US West)
Branch: main
Root Directory: [leave empty or specify if in subdirectory]
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### 3.3 Advanced Settings

**Health Check Path:**
```
/
```

**Pre-Deploy Command:** (Optional - for database migrations)
```
npm run migrate
```

**Auto-Deploy:**
```
✅ Enabled (deploys automatically on git push)
```

---

## 🔐 STEP 4: Configure Environment Variables

### 4.1 Go to "Environment" Tab

### 4.2 Add Environment Variables

Click **"Add Environment Variable"** for each:

#### Required Variables:

**1. NODE_ENV**
```
Key: NODE_ENV
Value: production
```

**2. PORT**
```
Key: PORT
Value: 10000
```

**3. DB_HOST** (from Step 2.3)
```
Key: DB_HOST
Value: [Your Render MySQL Internal Hostname]
Example: dpg-xxxxxxxxxx-a.oregon-postgres.render.com
```

**4. DB_PORT**
```
Key: DB_PORT
Value: 3306
```

**5. DB_USER** (from Step 2.3)
```
Key: DB_USER
Value: [Your MySQL Username]
```

**6. DB_PASSWORD** (from Step 2.3)
```
Key: DB_PASSWORD
Value: [Your MySQL Password]
```

**7. DB_NAME**
```
Key: DB_NAME
Value: vcet_alumni_hub
```

**8. SESSION_SECRET**
```
Key: SESSION_SECRET
Click: "Generate Value" button
(Or use a random 32+ character string)
```

**9. JWT_SECRET**
```
Key: JWT_SECRET
Click: "Generate Value" button
(Or use a random 32+ character string)
```

**10. BASE_URL**
```
Key: BASE_URL
Value: https://YOUR-APP-NAME.onrender.com
(You'll get this after deployment)
```

**11. MAX_FILE_SIZE**
```
Key: MAX_FILE_SIZE
Value: 5242880
```

**12. UPLOAD_DIR**
```
Key: UPLOAD_DIR
Value: /opt/render/project/src/uploads
```

---

## 📁 STEP 5: Configure Secret Files (Optional)

### Alternative to Environment Variables

Instead of individual variables, you can upload `.env` file:

1. Go to **"Secret Files"** section
2. Click **"Add Secret File"**
3. **Filename:** `.env`
4. **Contents:** Copy from `.env.render` template:

```env
NODE_ENV=production
PORT=10000
DB_HOST=your-render-mysql-host
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=vcet_alumni_hub
SESSION_SECRET=your-generated-secret
JWT_SECRET=your-generated-secret
BASE_URL=https://your-app.onrender.com
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/opt/render/project/src/uploads
```

---

## ✅ STEP 6: Deploy!

### 6.1 Save Configuration
Click **"Create Web Service"** button

### 6.2 Watch Build Process
- Render will start building your app
- Monitor logs in real-time
- Build takes ~3-5 minutes

### 6.3 Check Deployment Status
```
✅ Build started
✅ Installing dependencies (npm install)
✅ Build complete
✅ Starting application (npm start)
✅ Live
```

### 6.4 Get Your URL
```
https://vcet-alumni-hub.onrender.com
(or your custom name)
```

---

## 🧪 STEP 7: Test Your Deployment

### 7.1 Open Your App
Visit: `https://your-app-name.onrender.com`

### 7.2 Test Login
```
Admin: admin@vcet.edu / password
Alumni: rajesh.kumar@gmail.com / password
Student: student1@vcet.edu / password
```

### 7.3 Test Features
- ✅ Registration
- ✅ Login/Logout
- ✅ View Profiles
- ✅ Edit Profile
- ✅ Upload Profile Picture
- ✅ Alumni Directory
- ✅ Create Post
- ✅ Like Posts
- ✅ Job Board
- ✅ Admin Dashboard

---

## ⚠️ IMPORTANT: Free Tier Limitations

### Render Free Tier:
- ✅ 750 hours/month
- ✅ Auto-sleep after 15 min inactivity
- ✅ Cold start ~30 seconds
- ✅ 512MB RAM
- ✅ Shared CPU

### File Upload Issue on Free Tier:
⚠️ **Uploaded files will be lost on restart!**

**Solution:** Use cloud storage for production:

#### Option A: Cloudinary (Recommended)
```bash
npm install cloudinary multer-storage-cloudinary
```

#### Option B: AWS S3
```bash
npm install aws-sdk multer-s3
```

#### Option C: DigitalOcean Spaces
```bash
npm install aws-sdk multer-s3
```

---

## 🔄 STEP 8: Enable Persistent Storage (Upgrade Required)

### Option 1: Upgrade to Paid Plan ($7/month)
- Persistent disk included
- No cold starts
- Better performance

### Option 2: Use External Storage (Free Alternative)

**Cloudinary Setup:**
1. Sign up: https://cloudinary.com/ (Free: 25GB)
2. Get credentials from dashboard
3. Add to Render environment:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🚨 TROUBLESHOOTING

### Issue 1: "Cannot connect to database"
**Solution:**
- Check DB credentials in Environment Variables
- Ensure MySQL database is running (green status)
- Use **Internal** hostname (not External)
- Verify database name matches

### Issue 2: "Application failed to start"
**Solution:**
- Check deploy logs for errors
- Verify `package.json` has correct start command
- Ensure all dependencies are in `package.json` (not devDependencies)

### Issue 3: "502 Bad Gateway"
**Solution:**
- Server might be starting (wait 30 seconds)
- Check logs for startup errors
- Verify PORT environment variable is set

### Issue 4: "Session not persisting"
**Solution:**
- Ensure SESSION_SECRET is set
- Check if cookies are being blocked
- Verify HTTPS is enabled

### Issue 5: File uploads not working
**Solution:**
- Uploads on free tier don't persist
- Use Cloudinary or upgrade to paid plan
- Check UPLOAD_DIR permissions

---

## 📊 MONITORING

### View Logs
```
Dashboard → Your Service → Logs
```

### Metrics
```
Dashboard → Your Service → Metrics
- CPU usage
- Memory usage
- Request count
- Response time
```

### Restart Service
```
Dashboard → Your Service → Manual Deploy → "Clear build cache & deploy"
```

---

## 🔒 SECURITY CHECKLIST

Before going live:

- [ ] Change all default passwords in database
- [ ] Enable HTTPS (automatic on Render)
- [ ] Set strong SESSION_SECRET and JWT_SECRET
- [ ] Enable rate limiting (add express-rate-limit)
- [ ] Configure CORS properly
- [ ] Add CSP headers (already configured)
- [ ] Enable SQL injection protection (already using prepared statements)
- [ ] Validate all user inputs (already configured)
- [ ] Setup backup for database
- [ ] Monitor error logs regularly

---

## 🎉 DEPLOYMENT COMPLETE!

Your app is now live at:
```
https://your-app-name.onrender.com
```

### Next Steps:
1. **Custom Domain:** Add your own domain in Render settings
2. **SSL Certificate:** Automatic with Render
3. **CDN:** Render includes global CDN
4. **Monitoring:** Set up alerts in Render dashboard
5. **Backups:** Schedule MySQL backups

---

## 📞 SUPPORT

**Render Documentation:** https://render.com/docs
**Render Community:** https://community.render.com/
**Status Page:** https://status.render.com/

---

## 💡 TIPS FOR SUCCESS

1. **Push to GitHub regularly** - Auto-deploy will update your app
2. **Check logs frequently** - Catch errors early
3. **Use environment variables** - Never commit secrets
4. **Test locally first** - Before pushing to production
5. **Monitor performance** - Upgrade if needed
6. **Setup alerting** - Get notified of issues

---

**Your VCET Alumni Hub is now LIVE! 🚀**
