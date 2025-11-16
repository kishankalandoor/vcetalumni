# 🔧 Environment Setup Guide

## Quick Setup

### 1. Copy Environment File

```bash
cp .env.example .env
```

### 2. Update Environment Variables

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost        # Your MySQL host
DB_USER=root            # Your MySQL username
DB_PASSWORD=            # Your MySQL password (empty for XAMPP default)
DB_NAME=vcet_alumni_hub # Database name

# Session Secret (IMPORTANT: Change in production!)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# JWT Secret (IMPORTANT: Change in production!)
JWT_SECRET=your-jwt-secret-key-change-this-in-production
```

### 3. Start the Application

```bash
npm install
npm start
```

## Troubleshooting

### Error: "Missing required environment variables"

**Cause:** The `.env` file doesn't exist or is missing required variables.

**Solution:**
1. Copy `.env.example` to `.env`
2. Update the values in `.env`
3. Ensure at minimum these variables are set:
   - `DB_HOST`
   - `DB_USER`
   - `DB_NAME`

### Error: "Database connection failed: connect ETIMEDOUT"

**Cause:** Cannot connect to the MySQL database.

**Solutions:**
1. **Ensure MySQL is running:**
   ```bash
   # For XAMPP
   sudo /Applications/XAMPP/xamppfiles/xampp startmysql
   
   # For standalone MySQL (Linux)
   sudo systemctl start mysql
   
   # For standalone MySQL (macOS)
   brew services start mysql
   ```

2. **Verify database credentials:**
   - Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
   - Test connection: `mysql -h localhost -u root -p`

3. **Check if database exists:**
   ```bash
   mysql -u root -e "SHOW DATABASES LIKE 'vcet_alumni_hub';"
   ```

4. **Import database schema:**
   ```bash
   mysql -u root vcet_alumni_hub < database-export.sql
   ```

### Error: "Cannot read properties of undefined"

**Cause:** Missing environment variables that should have default values.

**Solution:**
- This should be fixed by the updated configuration
- If still occurring, ensure `.env` file exists and is properly formatted
- Check that `dotenv` is loaded at the top of `server.js`

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL user | `root` |
| `DB_NAME` | Database name | `vcet_alumni_hub` |

### Optional Variables (with defaults)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `localhost` |
| `DB_PASSWORD` | MySQL password | `` (empty) |
| `DB_PORT` | MySQL port | `3306` |
| `DB_CONNECTION_LIMIT` | Connection pool size | `10` |
| `SESSION_SECRET` | Session secret | Dev default |
| `SESSION_MAX_AGE` | Session duration (ms) | `86400000` (1 day) |
| `JWT_SECRET` | JWT secret | Dev default |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` |
| `APP_NAME` | Application name | `VCET Alumni Hub` |
| `BASE_URL` | Application URL | `http://localhost:3000` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |
| `BCRYPT_ROUNDS` | Password hash rounds | `10` |

## Production Configuration

### Security Checklist

When deploying to production:

1. **Change secrets:**
   ```env
   SESSION_SECRET=<generate-strong-random-string-32+chars>
   JWT_SECRET=<generate-strong-random-string-32+chars>
   ```

2. **Set production environment:**
   ```env
   NODE_ENV=production
   ```

3. **Update base URL:**
   ```env
   BASE_URL=https://your-domain.com
   ```

4. **Secure database:**
   ```env
   DB_PASSWORD=<strong-password>
   ```

5. **Configure for cloud hosting:**
   ```env
   # For Render.com
   PORT=10000
   HOST=0.0.0.0
   UPLOAD_DIR=/opt/render/project/src/uploads
   ```

### Generating Strong Secrets

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Cloud Deployment

### Render.com

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed instructions.

Quick checklist:
- [ ] Set all environment variables in Render dashboard
- [ ] Use internal database hostname
- [ ] Generate secure SESSION_SECRET and JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Update BASE_URL with your Render URL

### Heroku

```bash
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=<your-db-host>
heroku config:set DB_USER=<your-db-user>
heroku config:set DB_PASSWORD=<your-db-password>
heroku config:set DB_NAME=vcet_alumni_hub
heroku config:set SESSION_SECRET=$(openssl rand -hex 32)
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
```

### Docker

Create `.env` file for Docker:

```env
NODE_ENV=production
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=password
DB_NAME=vcet_alumni_hub
SESSION_SECRET=<random-string>
JWT_SECRET=<random-string>
```

## Testing Configuration

Verify your configuration:

```bash
# Test environment loading
node -e "require('dotenv').config(); console.log('DB_HOST:', process.env.DB_HOST)"

# Test database connection
npm start
# Look for: "✅ Database connected successfully"
```

## Common Issues

### Issue: Port already in use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or change port in .env
PORT=3001
```

### Issue: File uploads not working

```bash
# Ensure uploads directory exists
mkdir -p uploads/profiles uploads/posts

# Fix permissions
chmod -R 755 uploads/
```

### Issue: Session not persisting

- Ensure `SESSION_SECRET` is set
- Check browser cookies are enabled
- Verify `express-session` is configured correctly

## Need Help?

1. Check the error message - now includes troubleshooting tips
2. Verify `.env` file exists and has correct values
3. Check MySQL server is running
4. Review [SETUP.md](SETUP.md) for detailed setup instructions
5. See [README.md](README.md) for general documentation

## Resources

- [dotenv documentation](https://github.com/motdotla/dotenv)
- [MySQL2 documentation](https://github.com/sidorares/node-mysql2)
- [Express documentation](https://expressjs.com/)
