# Deployment Guide

Complete guide for deploying the Subodh KC personal website to production.

## Table of Contents

1. [Quick Deploy to Vercel](#quick-deploy-to-vercel)
2. [Alternative Deployment Options](#alternative-deployment-options)
3. [Environment Configuration](#environment-configuration)
4. [Post-Deployment Checklist](#post-deployment-checklist)
5. [Monitoring & Analytics](#monitoring--analytics)
6. [Troubleshooting](#troubleshooting)

## Quick Deploy to Vercel

Vercel is the recommended platform (built by Next.js creators).

### Option 1: Deploy via Vercel Dashboard

1. **Sign up / Log in to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `website` (if in subdirectory) or `.` (if root)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables**
   - Add any required environment variables
   - See `.env.example` for reference
   - Minimum required: `NEXT_PUBLIC_SITE_URL`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Site will be live at `your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project
cd website

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Option 3: GitHub Integration (Recommended)

1. Connect your GitHub repository to Vercel
2. Enable automatic deployments
3. Every push to `main` branch = automatic production deployment
4. Every pull request = preview deployment

**Benefits:**
- Automatic deployments
- Preview URLs for PRs
- Rollback capabilities
- CI/CD built-in

## Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project
cd website

# Build project
npm run build

# Deploy
netlify deploy --prod
```

**netlify.toml configuration:**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### AWS Amplify

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
3. Add environment variables
4. Deploy

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t subodhkc-website .
docker run -p 3000:3000 subodhkc-website
```

## Environment Configuration

### Required Variables

```bash
NEXT_PUBLIC_SITE_URL=https://subodhkc.com
```

### Optional Variables

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Email (for contact form)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password

# Newsletter integration
NEWSLETTER_API_KEY=your-api-key
NEWSLETTER_LIST_ID=your-list-id
```

### Environment-Specific Config

**Development (.env.local):**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production (.env.production):**
```bash
NEXT_PUBLIC_SITE_URL=https://subodhkc.com
```

## Post-Deployment Checklist

### Immediate Verification

- [ ] Site loads correctly
- [ ] All pages are accessible
- [ ] Navigation works on mobile and desktop
- [ ] Forms submit properly
- [ ] Images load
- [ ] No console errors

### SEO & Performance

- [ ] Run Lighthouse audit (target: 95+ score)
- [ ] Verify metadata on all pages
- [ ] Check Open Graph tags (test with [OpenGraph.xyz](https://www.opengraph.xyz))
- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt is accessible
- [ ] Test page load speed (target: <2s)

### Analytics Setup

- [ ] Add Google Analytics (if using)
- [ ] Configure event tracking
- [ ] Set up conversion goals
- [ ] Test analytics firing

### Domain Configuration

- [ ] Point domain to Vercel/hosting provider
- [ ] Configure DNS records:
  - A record: `@` → hosting provider IP
  - CNAME record: `www` → main domain
- [ ] Enable SSL certificate (automatic on Vercel)
- [ ] Verify HTTPS redirect works
- [ ] Test www and non-www versions

### Security

- [ ] Enable security headers (automatic with vercel.json)
- [ ] Verify CSP headers
- [ ] Test for common vulnerabilities
- [ ] Enable DDoS protection (if available)

### Monitoring

- [ ] Set up uptime monitoring (Uptime Robot, Pingdom)
- [ ] Configure error tracking (Sentry, LogRocket)
- [ ] Set up alerts for downtime
- [ ] Monitor Core Web Vitals

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `subodhkc.com`)
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-60 minutes)
5. Vercel automatically provisions SSL

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS (Netlify provides nameservers)
4. SSL auto-provisions

## Monitoring & Analytics

### Recommended Tools

1. **Performance Monitoring**
   - Vercel Analytics (built-in)
   - Google Lighthouse CI
   - WebPageTest

2. **Uptime Monitoring**
   - Uptime Robot (free)
   - Pingdom
   - Checkly

3. **Error Tracking**
   - Sentry
   - LogRocket
   - Bugsnag

4. **Analytics**
   - Google Analytics 4
   - Plausible (privacy-friendly)
   - Fathom

### Setting Up Monitoring

```bash
# Example: Add Sentry
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard -i nextjs
```

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Solution: Install dependencies
npm install
```

**Error: TypeScript errors**
```bash
# Solution: Check type errors
npm run build

# Fix or temporarily bypass (not recommended)
# Add to next.config.js:
typescript: {
  ignoreBuildErrors: true,
}
```

### Runtime Errors

**500 Internal Server Error**
- Check server logs in Vercel dashboard
- Verify environment variables are set
- Check for missing dependencies

**Pages not loading**
- Verify build output directory is correct
- Check routing configuration
- Review vercel.json settings

### Performance Issues

**Slow page loads**
- Enable Next.js Image Optimization
- Implement lazy loading
- Check bundle size: `npm run build`
- Use Vercel Analytics to identify issues

**High latency**
- Configure edge caching
- Enable ISR (Incremental Static Regeneration) where appropriate
- Use CDN (automatic with Vercel)

### SEO Issues

**Pages not indexed**
- Submit sitemap to Google Search Console
- Verify robots.txt allows crawling
- Check for noindex meta tags
- Ensure pages are server-rendered

**Missing metadata**
- Verify metadata in page components
- Check Open Graph tags
- Use testing tools

## Rollback Procedure

### Vercel

1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." menu → "Promote to Production"
4. Instant rollback (30 seconds)

### Manual Rollback

```bash
# If using git-based deployment
git revert HEAD
git push origin main

# Or reset to previous commit
git reset --hard <commit-hash>
git push --force origin main
```

## Performance Optimization

### Build-time Optimizations

- Enable output: 'standalone' in next.config.js
- Use static exports where possible
- Implement ISR for dynamic content
- Optimize images (use Next.js Image component)

### Runtime Optimizations

- Enable compression
- Use CDN (automatic with Vercel)
- Implement caching strategies
- Lazy load components

### Monitoring Performance

```bash
# Analyze bundle size
npm run build

# Generate bundle analyzer report
ANALYZE=true npm run build
```

## Support

For deployment issues:

1. Check [Next.js documentation](https://nextjs.org/docs)
2. Review [Vercel documentation](https://vercel.com/docs)
3. Contact: contact@subodhkc.com

## Maintenance

### Regular Tasks

- [ ] Weekly: Check uptime reports
- [ ] Weekly: Review analytics
- [ ] Monthly: Update dependencies (`npm update`)
- [ ] Monthly: Review error logs
- [ ] Quarterly: Run security audit (`npm audit`)
- [ ] Quarterly: Lighthouse audit

### Updates

```bash
# Update dependencies
npm update

# Check for major updates
npx npm-check-updates

# Update to latest (carefully)
npx npm-check-updates -u
npm install
```

---

**Last Updated:** November 2025
**Version:** 1.0.0
