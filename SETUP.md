# 🚀 VCET Alumni Hub - Node.js Setup Guide

## ✅ Installation Complete!

Your Node.js alumni platform is ready to run. Follow these simple steps:

---

## 🎯 Quick Start (3 Steps)

### Step 1: Ensure MySQL is Running
```bash
sudo /Applications/XAMPP/xamppfiles/xampp startmysql
```

### Step 2: Navigate to Project
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/alumnihub-nodejs
```

### Step 3: Start Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# OR Production mode
npm start
```

### Step 4: Open in Browser
```
http://localhost:3000
```

---

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@vcet.edu | password |
| **Alumni** | rajesh.kumar@gmail.com | password |
| **Student** | student1@vcet.edu | password |

---

## 📂 Project Structure

```
alumnihub-nodejs/
├── server.js                 # Main entry point
├── package.json              # Dependencies
├── .env                      # Configuration
├── config/
│   └── database.js           # MySQL connection
├── middleware/
│   ├── auth.js               # Authentication
│   └── upload.js             # File uploads
├── routes/                   # All route handlers
├── views/                    # EJS templates
├── public/                   # Static files (CSS, JS)
├── uploads/                  # User uploads
└── utils/                    # Helper functions
```

---

## ⚙️ Configuration

### Environment Variables (.env)

Already configured! Default settings:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vcet_alumni_hub
```

### Change Port (Optional)
Edit `.env` and change:
```env
PORT=3001
```

---

## 🗄️ Database

**Uses the same MySQL database as PHP version!**
- Database: `vcet_alumni_hub`
- Already imported with sample data
- No migration needed

To verify database:
```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "USE vcet_alumni_hub; SHOW TABLES;"
```

---

## 📱 Features Available

### ✅ Authentication
- User registration with validation
- Secure login (bcrypt password hashing)
- Session management
- Role-based access (Student/Alumni/Admin)

### ✅ User Profiles
- View & edit profiles
- Upload profile pictures
- Add skills, bio, social links
- Public profile pages

### ✅ Alumni Directory
- Search by name
- Filter by batch year, department, company, skills
- Mobile-optimized cards

### ✅ Newsfeed
- Create posts with images
- Like/unlike posts (AJAX)
- Real-time updates
- Post categories

### ✅ Job Board
- Post job opportunities (Alumni only)
- Filter by type, location
- Direct apply links
- Salary range display

### ✅ Admin Panel
- User management
- Post approval system
- Statistics dashboard
- Activity monitoring

---

## 🔧 Development

### Available Scripts

```bash
# Start with auto-restart (nodemon)
npm run dev

# Start normally
npm start

# Install dependencies
npm install
```

### File Structure for Development

- **Add routes**: `routes/` folder
- **Add views**: `views/` folder (EJS templates)
- **Add styles**: `public/css/mobile.css`
- **Add JavaScript**: `public/js/app.js`
- **Add middleware**: `middleware/` folder

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Option 1: Change port in .env
PORT=3001

# Option 2: Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Database connection error
```bash
# Start MySQL
sudo /Applications/XAMPP/xamppfiles/xampp startmysql

# Check if database exists
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "SHOW DATABASES LIKE 'vcet_alumni_hub';"
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### File upload not working
```bash
# Fix permissions
chmod -R 777 uploads/
```

### Session not persisting
```bash
# Clear browser cookies and try again
# Or restart server
```

---

## 🌐 Access from Mobile/Other Devices

### 1. Find Your Computer's IP Address
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### 2. Update .env
```env
BASE_URL=http://YOUR_IP_ADDRESS:3000
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Access from Mobile
```
http://YOUR_IP_ADDRESS:3000
```

---

## 🚀 Deployment to Production

### Option 1: Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "vcet-alumni-hub"

# Save configuration
pm2 save

# Setup auto-start on boot
pm2 startup
```

### Option 2: Using Systemd

Create `/etc/systemd/system/alumni-hub.service`:
```ini
[Unit]
Description=VCET Alumni Hub
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/alumnihub-nodejs
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl start alumni-hub
sudo systemctl enable alumni-hub
```

### Option 3: Cloud Platforms

#### Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create vcet-alumni-hub

# Add MySQL addon
heroku addons:create cleardb:ignite

# Deploy
git push heroku main
```

#### DigitalOcean/AWS/GCP
- Use Node.js droplet/instance
- Install MySQL
- Clone repository
- Run `npm install`
- Use PM2 or systemd
- Setup nginx reverse proxy

---

## 📊 Performance Tips

### 1. Use Production Mode
```env
NODE_ENV=production
```

### 2. Enable Gzip Compression
Already configured in `server.js`!

### 3. Database Connection Pooling
Already configured with 10 connections!

### 4. Static File Caching
Add to nginx config:
```nginx
location ~* \.(jpg|jpeg|png|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

---

## 🔒 Security Checklist

### For Production:
- [ ] Change SESSION_SECRET in .env
- [ ] Change JWT_SECRET in .env
- [ ] Set strong database password
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure firewall
- [ ] Setup automated backups
- [ ] Enable rate limiting
- [ ] Add helmet security headers (already configured)
- [ ] Setup monitoring (PM2, New Relic, etc.)

---

## 📈 Monitoring

### Check Server Status
```bash
# If using PM2
pm2 status
pm2 logs
pm2 monit
```

### Check Database
```bash
# Connect to MySQL
/Applications/XAMPP/xamppfiles/bin/mysql -u root

# Check connections
SHOW PROCESSLIST;
```

---

## 🆚 PHP vs Node.js Version

| Feature | PHP | Node.js |
|---------|-----|---------|
| Performance | Good | **Better** |
| Async Operations | Limited | **Native** |
| Package Management | Composer | **npm** |
| Real-time Features | Difficult | **Easy** |
| Scalability | Good | **Excellent** |
| Development Speed | Good | **Faster** |
| Database | Same | Same |
| Features | Same | **Same + More** |

**Both versions share the same database!** You can switch between them anytime.

---

## 💡 Next Steps

### Add More Features:
1. **WebSocket Chat**: Add Socket.io for real-time chat
2. **Email Service**: Integrate SendGrid/Nodemailer
3. **Push Notifications**: Add Firebase Cloud Messaging
4. **Password Reset**: Complete forgot password feature
5. **Two-Factor Auth**: Add 2FA with speakeasy
6. **Payment Gateway**: Add Stripe/PayPal for donations
7. **GraphQL API**: Convert REST to GraphQL
8. **Docker**: Containerize the application

### Example: Add WebSocket Chat
```bash
npm install socket.io
```

```javascript
// In server.js
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});
```

---

## 📚 Resources

- **Express.js Docs**: https://expressjs.com/
- **EJS Templating**: https://ejs.co/
- **MySQL2**: https://github.com/sidorares/node-mysql2
- **Bcrypt**: https://github.com/kelektiv/node.bcrypt.js
- **Multer**: https://github.com/expressjs/multer

---

## 🎉 You're All Set!

Your Node.js alumni platform is ready to use!

```bash
# Start the server now:
cd /Applications/XAMPP/xamppfiles/htdocs/alumnihub-nodejs
npm run dev

# Open: http://localhost:3000
# Login: admin@vcet.edu / password
```

---

## 📞 Support

- Check logs: `console.log` output in terminal
- Database issues: Check XAMPP MySQL
- File permissions: `chmod 777 uploads/`
- Port conflicts: Change PORT in .env

**Happy Coding! 🚀**
