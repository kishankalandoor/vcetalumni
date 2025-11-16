# 🎓 VCET Alumni Hub - Node.js Version

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)

**Complete Mobile-First Alumni Networking Platform built with Node.js, Express, MySQL**

## ✨ Features

- ✅ Complete authentication system (Register, Login, Session Management)
- ✅ User profiles with image uploads
- ✅ Alumni directory with advanced search
- ✅ Newsfeed with posts and likes
- ✅ Job board with filtering
- ✅ Admin dashboard
- ✅ Mobile-first responsive design
- ✅ RESTful API
- ✅ Secure file uploads (Multer)
- ✅ Password hashing (bcryptjs)
- ✅ Session management (express-session)
- ✅ Input validation (express-validator)
- ✅ Flash messages
- ✅ CSRF protection ready

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+
- XAMPP (for MySQL) or standalone MySQL

### Installation

1. **Install Dependencies**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/alumnihub-nodejs
npm install
```

2. **Configure Environment**
```bash
# .env file is already created
# Update if needed: DB credentials, ports, etc.
```

3. **Import Database**
```bash
# Use the same database from PHP version
# Database: vcet_alumni_hub
# Already created with sample data
```

4. **Start Server**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

5. **Access Application**
```
http://localhost:3000
```

## 📁 Project Structure

```
alumnihub-nodejs/
├── server.js                 # Main application entry
├── package.json             # Dependencies & scripts
├── .env                     # Environment configuration
├── config/
│   └── database.js          # MySQL connection pool
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── upload.js           # File upload (Multer)
├── routes/
│   ├── index.js            # Landing page
│   ├── auth.js             # Login, register, logout
│   ├── dashboard.js        # Main dashboard
│   ├── profile.js          # Profile view/edit
│   ├── directory.js        # Alumni directory
│   ├── newsfeed.js         # Posts feed
│   ├── jobs.js             # Job listings
│   ├── admin.js            # Admin panel
│   └── api.js              # REST API endpoints
├── views/
│   ├── layout.ejs          # Main layout template
│   ├── index.ejs           # Landing page
│   ├── partials/           # Reusable components
│   ├── auth/               # Auth pages
│   ├── dashboard/          # Dashboard
│   ├── profile/            # Profile pages
│   ├── directory/          # Directory
│   ├── newsfeed/           # Newsfeed
│   ├── jobs/               # Jobs
│   └── admin/              # Admin
├── public/
│   ├── css/
│   │   └── mobile.css      # Mobile-first styles
│   └── js/
│       └── app.js          # Client-side JavaScript
├── uploads/
│   ├── profiles/           # Profile pictures
│   └── posts/              # Post images
└── utils/
    └── helpers.js          # Utility functions
```

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vcet.edu | password |
| Alumni | rajesh.kumar@gmail.com | password |
| Student | student1@vcet.edu | password |

## 🛠️ Available Scripts

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start

# Install dependencies
npm install
```

## 🔧 Configuration

### Environment Variables (.env)

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vcet_alumni_hub
SESSION_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
MAX_FILE_SIZE=5242880
```

### Database

Uses the same MySQL database as the PHP version:
- Database: `vcet_alumni_hub`
- Tables: users, profiles, posts, jobs, comments, post_likes

## 📱 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/logout` - Logout

### Posts
- `GET /newsfeed` - View all posts
- `POST /newsfeed/create` - Create post (Alumni only)
- `POST /api/like-post` - Like/unlike post

### Jobs
- `GET /jobs` - List all jobs
- `POST /jobs/create` - Post job (Alumni only)

### Profile
- `GET /profile/:id` - View profile
- `POST /profile/edit/:id` - Update profile

### Directory
- `GET /directory` - Alumni directory with filters

### Admin
- `GET /admin` - Admin dashboard
- `POST /admin/posts/:id/approve` - Approve post
- `POST /admin/posts/:id/delete` - Delete post

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ Session-based authentication
- ✅ Input validation with express-validator
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection
- ✅ File upload validation
- ✅ Helmet.js for HTTP headers
- ✅ CORS support

## 🎨 Frontend

- **Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Template Engine**: EJS
- **Mobile-First**: 100% responsive design
- **Features**:
  - Bottom navigation
  - Touch-optimized UI
  - Smooth animations
  - Flash messages
  - Form validation

## 🚀 Deployment

### Production Checklist

1. Update .env for production:
```env
NODE_ENV=production
SESSION_SECRET=strong-random-secret
JWT_SECRET=strong-random-jwt-secret
```

2. Use process manager:
```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "vcet-alumni-hub"
pm2 save
pm2 startup
```

3. Set up reverse proxy (nginx):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Performance

- Connection pooling for MySQL
- Static file caching
- Compression middleware
- Optimized queries with indexes
- Session store optimization

## 🐛 Troubleshooting

### Port already in use
```bash
# Change PORT in .env file
PORT=3001
```

### Database connection error
```bash
# Check MySQL is running
sudo /Applications/XAMPP/xamppfiles/xampp startmysql

# Verify credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vcet_alumni_hub
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Migration from PHP

This Node.js version uses the **same database** as the PHP version, so:
- ✅ All existing data works
- ✅ Same user accounts
- ✅ Same posts and jobs
- ✅ No data migration needed
- ✅ Can run both versions simultaneously (different ports)

## 📈 Advantages over PHP Version

1. **Performance**: Faster with async/await and connection pooling
2. **Modern Stack**: ES6+ JavaScript features
3. **Package Management**: npm ecosystem
4. **Development**: Hot reload with nodemon
5. **API Ready**: RESTful API structure
6. **Scalability**: Better for high-traffic scenarios
7. **Real-time Ready**: Easy to add WebSockets
8. **Deployment**: Easier cloud deployment (Heroku, AWS, DigitalOcean)

## 🎯 Future Enhancements

- [ ] WebSocket for real-time notifications
- [ ] GraphQL API
- [ ] Redis for session store
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Chat system
- [ ] Event management
- [ ] Advanced analytics
- [ ] Mobile app API
- [ ] Docker containerization

## 📝 License

MIT License - feel free to use for your projects

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📞 Support

- **GitHub Issues**: [Create an issue]
- **Documentation**: See inline comments in code
- **Email**: support@vcetalumnihub.com

---

**Made with ❤️ for VCET Community using Node.js + Express + MySQL**

## 🎉 Getting Started Right Now

```bash
# Quick 3-step start:
cd /Applications/XAMPP/xamppfiles/htdocs/alumnihub-nodejs
npm install
npm run dev

# Open browser: http://localhost:3000
# Login with: admin@vcet.edu / password
```

**Enjoy your glitch-free Node.js alumni platform! 🚀**
