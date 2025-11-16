# ✅ RENDER DEPLOYMENT CHECKLIST

## Before You Start
- [ ] GitHub account created
- [ ] Render account created (https://render.com)
- [ ] Code working locally on http://localhost:3000

---

## 📋 DEPLOYMENT STEPS

### 1️⃣ PUSH TO GITHUB (10 minutes)
- [ ] Create new repository on GitHub
- [ ] Run: `./deploy-to-render.sh` (automated script)
- [ ] Or manually:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin YOUR_GITHUB_URL
  git push -u origin main
  ```

### 2️⃣ CREATE MYSQL DATABASE (5 minutes)
- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "MySQL"
- [ ] Name: `vcet-alumni-hub-db`
- [ ] Database: `vcet_alumni_hub`
- [ ] Region: Oregon (US West)
- [ ] Plan: Free
- [ ] Click "Create Database"
- [ ] **SAVE CREDENTIALS:**
  - [ ] Hostname (Internal): ___________________
  - [ ] Port: 3306
  - [ ] Username: ___________________
  - [ ] Password: ___________________
  - [ ] Database: vcet_alumni_hub

### 3️⃣ IMPORT DATABASE (5 minutes)
- [ ] In Render MySQL dashboard, click "Connect"
- [ ] Use Shell or external tool
- [ ] Import `database-export.sql` file

**Option A: Using Render Shell**
```sql
-- Copy contents of database-export.sql and paste in shell
```

**Option B: Using MySQL Workbench**
- Connect with Render credentials
- Import → `database-export.sql`

### 4️⃣ CREATE WEB SERVICE (5 minutes)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select your repo: `vcet-alumni-hub`
- [ ] Fill in:
  - Name: `vcet-alumni-hub`
  - Region: `Oregon`
  - Branch: `main`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: `Free`

### 5️⃣ CONFIGURE ENVIRONMENT (10 minutes)

Click "Environment" tab and add these variables:

**Database Variables** (from Step 2):
- [ ] `DB_HOST` = [Your MySQL Internal Hostname]
- [ ] `DB_PORT` = 3306
- [ ] `DB_USER` = [Your MySQL Username]
- [ ] `DB_PASSWORD` = [Your MySQL Password]
- [ ] `DB_NAME` = vcet_alumni_hub

**Server Variables**:
- [ ] `NODE_ENV` = production
- [ ] `PORT` = 10000

**Security Variables** (Click "Generate Value"):
- [ ] `SESSION_SECRET` = [Generate]
- [ ] `JWT_SECRET` = [Generate]

**App Variables**:
- [ ] `MAX_FILE_SIZE` = 5242880
- [ ] `UPLOAD_DIR` = /opt/render/project/src/uploads

**Base URL** (Add after deployment):
- [ ] `BASE_URL` = https://[your-app-name].onrender.com

### 6️⃣ ADVANCED SETTINGS (2 minutes)
- [ ] Health Check Path: `/`
- [ ] Auto-Deploy: `Enabled` ✅
- [ ] Pre-Deploy Command: (leave empty)

### 7️⃣ DEPLOY (5 minutes)
- [ ] Click "Create Web Service"
- [ ] Wait for build (3-5 minutes)
- [ ] Watch logs for errors
- [ ] Status becomes "Live" ✅

### 8️⃣ UPDATE BASE_URL (1 minute)
- [ ] Copy your app URL: `https://[name].onrender.com`
- [ ] Go back to "Environment"
- [ ] Update `BASE_URL` with your URL
- [ ] Service will auto-redeploy

### 9️⃣ TEST YOUR APP (5 minutes)
- [ ] Visit your app URL
- [ ] Test login with demo accounts:
  - Admin: `admin@vcet.edu` / `password`
  - Alumni: `rajesh.kumar@gmail.com` / `password`
  - Student: `student1@vcet.edu` / `password`
- [ ] Test features:
  - [ ] Registration
  - [ ] Profile view/edit
  - [ ] Alumni directory
  - [ ] Create post
  - [ ] Like post
  - [ ] Job board
  - [ ] Admin panel

---

## 🎉 SUCCESS!

Your app is live at: `https://[your-app-name].onrender.com`

---

## ⚠️ IMPORTANT NOTES

### Free Tier Limitations:
- ✅ App sleeps after 15 min inactivity (cold start ~30s)
- ⚠️ Uploaded files lost on restart (use Cloudinary for production)
- ✅ 750 hours/month free
- ✅ 512MB RAM, Shared CPU

### File Upload Solution:
**Use Cloudinary (Free 25GB):**
1. Sign up: https://cloudinary.com
2. Get credentials
3. Add to Render environment:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

## 🚨 TROUBLESHOOTING

**"Cannot connect to database"**
→ Check DB_HOST uses Internal hostname (not External)

**"502 Bad Gateway"**
→ Wait 30 seconds (server starting)

**"Application failed to start"**
→ Check deploy logs for errors

**"Session not working"**
→ Verify SESSION_SECRET is set

---

## 📞 NEED HELP?

- 📖 Full Guide: `RENDER_DEPLOYMENT.md`
- 🔧 Environment Template: `.env.render`
- 💬 Render Community: https://community.render.com
- 📚 Render Docs: https://render.com/docs

---

**Time Estimate: ~45 minutes total**
