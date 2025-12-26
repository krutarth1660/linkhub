# 🔧 LinkHub Environment Setup Guide

This guide will walk you through setting up all the required environment variables and external services for the LinkHub project.

## 📋 Table of Contents

1. [Database Setup](#database-setup)
2. [Authentication Services](#authentication-services)
3. [Redis Cache Setup](#redis-cache-setup)
4. [File Upload Service](#file-upload-service)
5. [Email Service](#email-service)
6. [Analytics Setup](#analytics-setup)
7. [Final Environment File](#final-environment-file)

---

## 🗄️ Database Setup

### Option 1: Neon (Recommended - Free)

1. **Go to [Neon.tech](https://neon.tech)**
2. **Sign up** for a free account
3. **Create a new project** called "LinkHub"
4. **Copy the connection string** from the dashboard
5. **Replace** `username:password@localhost:5432/linkhub` with your Neon URL

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Option 2: Supabase (Alternative - Free)

1. **Go to [Supabase.com](https://supabase.com)**
2. **Create a new project**
3. **Go to Settings > Database**
4. **Copy the connection string** and replace `[YOUR-PASSWORD]` with your actual password

### Option 3: Local PostgreSQL

1. **Install PostgreSQL** from [postgresql.org](https://www.postgresql.org/download/)
2. **Create a database:**
   ```sql
   CREATE DATABASE linkhub;
   CREATE USER linkhub_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE linkhub TO linkhub_user;
   ```
3. **Use local connection:**
   ```env
   DATABASE_URL="postgresql://linkhub_user:your_password@localhost:5432/linkhub"
   DIRECT_URL="postgresql://linkhub_user:your_password@localhost:5432/linkhub"
   ```

---

## 🔐 Authentication Services

### NextAuth Configuration

1. **Generate a secret key:**
   ```bash
   # Run this command to generate a random secret
   openssl rand -base64 32
   ```
   
2. **Set your app URL:**
   ```env
   NEXTAUTH_URL="http://localhost:3000"  # For development
   NEXTAUTH_SECRET="your-generated-secret-key-here"
   ```

### Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing one
3. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. **Copy the credentials:**
   ```env
   GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

### GitHub OAuth Setup

1. **Go to [GitHub Settings](https://github.com/settings/developers)**
2. **Click "New OAuth App"**
3. **Fill in the details:**
   - Application name: `LinkHub`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. **Create the app and copy credentials:**
   ```env
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

---

## 🚀 Redis Cache Setup

### Option 1: Upstash (Recommended - Free)

1. **Go to [Upstash.com](https://upstash.com)**
2. **Sign up** for a free account
3. **Create a Redis database:**
   - Click "Create Database"
   - Choose a region close to you
   - Select "Free" tier
4. **Copy the connection details:**
   ```env
   REDIS_URL="redis://default:your-password@region.upstash.io:port"
   UPSTASH_REDIS_REST_URL="https://prime-garfish-36392.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AY4oAAIncDFmMmE0ZGEyMDVmMDA0OWFhOWU2OTc4OTZhNzY1NzU5N3AxMzYzOTI"

   ```

### Option 2: Local Redis

1. **Install Redis:**
   ```bash
   # Windows (using Chocolatey)
   choco install redis-64
   
   # macOS (using Homebrew)
   brew install redis
   
   # Ubuntu/Debian
   sudo apt install redis-server
   ```

2. **Start Redis:**
   ```bash
   redis-server
   ```

3. **Use local connection:**
   ```env
   REDIS_URL="redis://localhost:6379"
   ```

---

## 📁 File Upload Service (UploadThing)

1. **Go to [UploadThing.com](https://uploadthing.com)**
2. **Sign up** with your GitHub account
3. **Create a new app:**
   - Click "Create App"
   - Name it "LinkHub"
4. **Copy the API keys:**
   ```env
UPLOADTHING_SECRET='sk_live_your-uploadthing-secret-key'
UPLOADTHING_APP_ID='your-uploadthing-app-id'
   ```

### Alternative: Cloudinary (Free)

1. **Go to [Cloudinary.com](https://cloudinary.com)**
2. **Sign up** for a free account
3. **Get your credentials** from the dashboard:
   ```env
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

---

## 📧 Email Service Setup

### Option 1: Gmail SMTP (Free)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate password for "Mail"
3. **Use Gmail SMTP:**
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-16-character-app-password"
   ```

### Option 2: Resend (Recommended)

1. **Go to [Resend.com](https://resend.com)**
2. **Sign up** for a free account
3. **Create an API key:**
   ```env
   RESEND_API_KEY="re_your-resend-api-key"
   SMTP_HOST="smtp.resend.com"
   SMTP_PORT="587"
   SMTP_USER="resend"
   SMTP_PASS="re_your-resend-api-key"
   ```

### Option 3: SendGrid (Free Tier)

1. **Go to [SendGrid.com](https://sendgrid.com)**
2. **Sign up** for a free account
3. **Create an API key:**
   ```env
   SENDGRID_API_KEY="SG.your-sendgrid-api-key"
   SMTP_HOST="smtp.sendgrid.net"
   SMTP_PORT="587"
   SMTP_USER="apikey"
   SMTP_PASS="SG.your-sendgrid-api-key"
   ```

---

## 📊 Analytics Setup

### Vercel Analytics (Free)

1. **Deploy to Vercel** or sign up at [Vercel.com](https://vercel.com)
2. **Enable Analytics** in your project dashboard
3. **Copy the Analytics ID:**
   ```env
   VERCEL_ANALYTICS_ID="your-vercel-analytics-id"
   ```

### Alternative: Google Analytics

1. **Go to [Google Analytics](https://analytics.google.com)**
2. **Create a new property**
3. **Get your Measurement ID:**
   ```env
   GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
   ```

---

## 🌐 App Configuration

```env
# Development URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_DOMAIN="localhost:3000"

# Production URLs (update when deploying)
# NEXT_PUBLIC_APP_URL="https://yourdomain.com"
# NEXT_PUBLIC_APP_DOMAIN="yourdomain.com"
```

---

## 📝 Final Environment File

Create a `.env.local` file in your project root with all the values:

```env
# Database (Choose one option from above)
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Redis (Choose one option from above)
REDIS_URL="redis://default:password@region.upstash.io:port"
UPSTASH_REDIS_REST_URL="https://region.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# File Upload
UPLOADTHING_SECRET="sk_live_your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_DOMAIN="localhost:3000"

# Analytics (Optional)
VERCEL_ANALYTICS_ID="your-vercel-analytics-id"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

---

## ✅ Verification Steps

1. **Test Database Connection:**
   ```bash
   npm run db:push
   ```

2. **Test Redis Connection:**
   ```bash
   # In your app, try connecting to Redis
   ```

3. **Test Email Service:**
   ```bash
   # Send a test email through your SMTP settings
   ```

4. **Test File Upload:**
   ```bash
   # Try uploading a file through UploadThing
   ```

---

## 🚀 Quick Start (Minimal Setup)

If you want to get started quickly with minimal external dependencies:

```env
# Minimal .env.local for development
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Add OAuth providers later
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
```

This minimal setup will get your app running. You can add other services as needed.

---

## 🔒 Security Notes

- **Never commit** your `.env.local` file to version control
- **Use different credentials** for development and production
- **Rotate secrets regularly** in production
- **Use environment-specific URLs** (localhost for dev, your domain for prod)
- **Enable 2FA** on all service accounts

---

## 🆘 Troubleshooting

### Common Issues:

1. **Database connection fails:**
   - Check if the database URL is correct
   - Ensure the database exists
   - Verify network connectivity

2. **OAuth not working:**
   - Check redirect URLs match exactly
   - Ensure OAuth apps are configured correctly
   - Verify client IDs and secrets

3. **File upload fails:**
   - Check UploadThing API keys
   - Verify file size limits
   - Ensure proper CORS settings

4. **Email not sending:**
   - Test SMTP credentials
   - Check spam folders
   - Verify app passwords (for Gmail)

### Getting Help:

- Check service documentation
- Look at error logs
- Test each service individually
- Use environment variable validation

---

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [UploadThing Documentation](https://docs.uploadthing.com)
- [Upstash Documentation](https://docs.upstash.com)
- [Vercel Analytics Documentation](https://vercel.com/analytics)

---

**🎉 You're all set!** Your LinkHub application should now have all the necessary environment variables configured.