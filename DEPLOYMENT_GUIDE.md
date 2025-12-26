# 🚀 LinkHub Deployment Guide

Complete step-by-step guide for deploying your LinkHub project to production using Git and Vercel.

## 📋 Table of Contents

1. [Git Setup & Push to GitHub](#git-setup--push-to-github)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment (Railway/Render)](#backend-deployment-railwayrender)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Domain Configuration](#domain-configuration)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Git Setup & Push to GitHub

### **Step 1: Initialize Git Repository**

```bash
# Navigate to your project root
cd "D:\my personal project\LinkHub"

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: LinkHub project setup"
```

### **Step 2: Create GitHub Repository**

1. **Go to [GitHub.com](https://github.com)**
2. **Click "New Repository"**
3. **Repository Details:**
   - Repository name: `linkhub`
   - Description: `Multi-tenant link sharing platform with analytics`
   - Visibility: `Public` (or Private if you prefer)
   - **Don't** initialize with README, .gitignore, or license (we already have files)
4. **Click "Create Repository"**

### **Step 3: Connect Local Repository to GitHub**

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/linkhub.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### **Step 4: Create .gitignore File**

The `.gitignore` file is already created. If you need to update it, add any additional files you want to exclude from version control.

### **Step 5: Push Updates to GitHub**

```bash
# Add the .gitignore file
git add .gitignore

# Commit the changes
git commit -m "Add .gitignore file"

# Push to GitHub
git push origin main
```

---

## 🌐 Frontend Deployment (Vercel)

### **Step 1: Connect GitHub to Vercel**

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository:**
   - Select your `linkhub` repository
   - Click "Import"

### **Step 2: Configure Project Settings**

1. **Project Settings:**
   - **Project Name:** `linkhub` (or your preferred name)
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install`

2. **Click "Deploy"** (Don't worry about environment variables yet)

### **Step 3: Add Environment Variables**

After the initial deployment, add environment variables:

1. **Go to your project dashboard on Vercel**
2. **Click "Settings" tab**
3. **Click "Environment Variables"**
4. **Add the following variables:**

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_rPnEBT9DS0jp@ep-long-frog-a46uqvax-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DIRECT_URL=postgresql://neondb_owner:npg_rPnEBT9DS0jp@ep-long-frog-a46uqvax-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# NextAuth
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=linkhub-nextauth-secret-2024-change-in-production

# OAuth Providers
GOOGLE_CLIENT_ID=1087917212866-9telt62bjsa36l7ori9phr3nurpr7oi8.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GITHUB_CLIENT_ID=Ov23likJQzxmJxEdA86D
GITHUB_CLIENT_SECRET=f98ca9b9ff9ed06a6886e1a525a6e8d73a42e424

# Redis
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

# UploadThing
UPLOADTHING_SECRET=sk_live_your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_DOMAIN=your-app-name.vercel.app
```

**Important:** Replace `your-app-name.vercel.app` with your actual Vercel domain.

### **Step 4: Redeploy with Environment Variables**

1. **Go to "Deployments" tab**
2. **Click "Redeploy" on the latest deployment**
3. **Check "Use existing Build Cache"**
4. **Click "Redeploy"**

---

## 🚀 Backend Deployment (Railway)

### **Step 1: Prepare Backend for Deployment**

1. **Create a separate repository for backend** (recommended) or use the same repo:

```bash
# Option 1: Same repository (monorepo approach)
# Your backend is already in the /backend folder

# Option 2: Separate repository
cd backend
git init
git add .
git commit -m "Initial backend commit"
# Create new GitHub repo and push
```

### **Step 2: Deploy to Railway**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository:**
   - If monorepo: Select main repo and set root directory to `/backend`
   - If separate repo: Select your backend repository

### **Step 3: Configure Railway Settings**

1. **Build Settings:**
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** `/backend` (if monorepo)

2. **Add Environment Variables:**

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_rPnEBT9DS0jp@ep-long-frog-a46uqvax-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=linkhub-super-secret-jwt-key-2024-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app-name.vercel.app
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### **Step 4: Update Frontend to Use Production Backend**

Update your frontend environment variables to point to the Railway backend:

```env
# Add to Vercel environment variables
NEXT_PUBLIC_API_URL=https://your-backend-name.railway.app
```

---

## 🔧 Environment Variables Setup

### **Frontend (.env.local for local development)**

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_rPnEBT9DS0jp@ep-long-frog-a46uqvax-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://neondb_owner:npg_rPnEBT9DS0jp@ep-long-frog-a46uqvax-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="linkhub-nextauth-secret-2024-change-in-production"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Redis
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

# UploadThing
UPLOADTHING_SECRET="sk_live_your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_DOMAIN="localhost:3000"
```

### **Backend (.env for local development)**

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://neondb_owner:npg_rPnEBT9DS0jp@ep-long-frog-a46uqvax-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="linkhub-super-secret-jwt-key-2024-change-in-production"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

---

## 🌍 Domain Configuration

### **Step 1: Update OAuth Redirect URLs**

After deployment, update your OAuth applications:

#### **Google OAuth Console:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `https://your-app-name.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)

#### **GitHub OAuth App:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Edit your OAuth App
3. Update Authorization callback URL:
   - `https://your-app-name.vercel.app/api/auth/callback/github`

### **Step 2: Custom Domain (Optional)**

If you want to use a custom domain:

1. **In Vercel:**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables:**
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your custom domain
   - Update OAuth redirect URLs to use custom domain

---

## 🧪 Post-Deployment Testing

### **Step 1: Test Basic Functionality**

1. **Visit your deployed app**
2. **Test user registration/login**
3. **Create a test link**
4. **Test public profile page**
5. **Test analytics tracking**

### **Step 2: Test API Endpoints**

```bash
# Test backend health
curl https://your-backend-name.railway.app/health

# Test authentication
curl -X POST https://your-backend-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword"}'
```

### **Step 3: Monitor Logs**

- **Vercel:** Check function logs in Vercel dashboard
- **Railway:** Check application logs in Railway dashboard

---

## 🔧 Troubleshooting

### **Common Issues:**

#### **1. Environment Variables Not Loading**
- Ensure all environment variables are added to both Vercel and Railway
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

#### **2. Database Connection Issues**
- Verify DATABASE_URL is correct
- Check if Neon database is accessible from deployment platforms
- Ensure SSL mode is properly configured

#### **3. OAuth Authentication Failing**
- Verify redirect URLs are updated in OAuth providers
- Check NEXTAUTH_URL matches your deployed domain
- Ensure OAuth secrets are correctly set

#### **4. CORS Issues**
- Update FRONTEND_URL in backend environment variables
- Check if Railway backend allows requests from Vercel frontend

#### **5. Build Failures**
- Check build logs for specific errors
- Ensure all dependencies are in package.json
- Verify TypeScript compilation passes

### **Debug Commands:**

```bash
# Check environment variables (locally)
npm run dev

# Test database connection
npx prisma db push

# Check build process
npm run build

# Test production build locally
npm run start
```

---

## 📝 Final Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] All environment variables configured
- [ ] OAuth redirect URLs updated
- [ ] Database connection working
- [ ] Basic functionality tested
- [ ] Analytics tracking working
- [ ] Public profiles accessible

---

## 🎉 Success!

Your LinkHub application is now live! 

- **Frontend:** `https://your-app-name.vercel.app`
- **Backend API:** `https://your-backend-name.railway.app`

Remember to:
- Monitor your application logs
- Set up proper error tracking (Sentry, etc.)
- Configure domain and SSL certificates
- Set up automated backups for your database
- Monitor usage and scale as needed

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review deployment platform documentation
3. Check application logs for specific error messages
4. Ensure all environment variables are correctly configured