# Deployment Guide - Netlify

This guide will help you deploy the Network Diagnosis app to Netlify.

## Prerequisites

- A GitHub account
- A Netlify account (free tier available)
- The project code pushed to a GitHub repository

## Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Verify your repository structure**:
   ```
   network-diagnosis/
   ├── netlify.toml          # Netlify configuration
   ├── package.json          # Dependencies and scripts
   ├── vite.config.ts        # Vite configuration
   ├── tailwind.config.js    # Tailwind CSS configuration
   ├── src/                  # Source code
   └── dist/                 # Build output (will be generated)
   ```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended for first deployment)

1. **Go to [Netlify](https://netlify.com)** and sign in
2. **Click "New site from Git"**
3. **Connect your GitHub account** if not already connected
4. **Select your repository**: `network-diagnosis`
5. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18` (or latest LTS)
6. **Click "Deploy site"**

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy from your project directory**:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Environment Variables (Optional)

If you need environment variables for your app:

1. **Go to your site settings** in Netlify dashboard
2. **Navigate to "Environment variables"**
3. **Add any required variables**:
   ```
   NODE_ENV=production
   VITE_APP_TITLE=Network Diagnosis
   ```

## Step 4: Custom Domain (Optional)

1. **Go to "Domain settings"** in your site dashboard
2. **Click "Add custom domain"**
3. **Follow the DNS configuration instructions**

## Step 5: Verify Deployment

1. **Check your live site** at the provided Netlify URL
2. **Test all features**:
   - Speed tests (simulated)
   - Network diagnostics
   - History functionality
   - PWA features

## Configuration Files

### netlify.toml
The `netlify.toml` file contains:
- Build settings and commands
- Redirect rules for SPA routing
- Security headers
- Cache optimization

### Key Features Configured

1. **SPA Routing**: All routes redirect to `index.html`
2. **Security Headers**: XSS protection, content type options
3. **Cache Optimization**: Static assets cached for 1 year
4. **PWA Support**: Service worker and manifest handling

## Troubleshooting

### Build Failures
- **Check Node.js version**: Ensure you're using Node 18+
- **Verify dependencies**: Run `npm install` locally
- **Check build logs**: Review Netlify build logs for errors

### Runtime Issues
- **CORS errors**: Expected for simulated speed tests
- **PWA not working**: Check manifest and service worker paths
- **Routing issues**: Verify `netlify.toml` redirects

### Performance Issues
- **Large bundle size**: Check for unused dependencies
- **Slow loading**: Verify image optimization
- **Caching issues**: Check cache headers in `netlify.toml`

## Monitoring and Analytics

1. **Enable Netlify Analytics** (optional)
2. **Set up error tracking** (e.g., Sentry)
3. **Monitor performance** with browser dev tools

## Continuous Deployment

Once deployed, Netlify will automatically:
- **Deploy on every push** to your main branch
- **Create preview deployments** for pull requests
- **Rollback** to previous versions if needed

## Support

- **Netlify Documentation**: [docs.netlify.com](https://docs.netlify.com)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **Project Issues**: Check GitHub repository issues

---

Your Network Diagnosis app should now be live and accessible to users worldwide! 🌐 