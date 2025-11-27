# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Resend Account**: Sign up at [resend.com](https://resend.com) for email functionality
3. **GitHub Repository**: Your code should be pushed to GitHub

## Step 1: Configure Resend

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Create a new API key
3. Copy the API key (starts with `re_`)
4. Verify your domain at [resend.com/domains](https://resend.com/domains)
   - Add DNS records as instructed by Resend
   - Use `noreply@subodhkc.com` as the sender email

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (Leave empty - website is at repository root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   NEXT_PUBLIC_SITE_URL=https://subodhkc.com
   ```

5. Click **Deploy**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project directory
cd personal-website

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 3: Configure Custom Domain

1. In Vercel Dashboard, go to your project
2. Navigate to **Settings** → **Domains**
3. Add your domain: `subodhkc.com`
4. Add DNS records as instructed by Vercel:
   - **A Record**: `@` → Vercel IP
   - **CNAME**: `www` → `cname.vercel-dns.com`

## Step 4: Environment Variables in Vercel

Add these in **Settings** → **Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `RESEND_API_KEY` | `re_xxxxx` (from Resend) | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://subodhkc.com` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://preview.vercel.app` | Preview |

### Optional Variables (if needed):

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXTAUTH_URL` | `https://subodhkc.com` | NextAuth authentication |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | NextAuth secret |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics |

## Step 5: Verify Deployment

1. **Check Build Logs**: Ensure no errors in Vercel dashboard
2. **Test Contact Form**: 
   - Visit `/contact`
   - Submit a test message
   - Check `Subodh.kc@haiec.com` for email
3. **Test SEO**:
   - Visit `https://subodhkc.com/sitemap.xml`
   - Visit `https://subodhkc.com/robots.txt`
4. **Performance Check**: Run Lighthouse audit
5. **Mobile Test**: Check responsiveness on mobile devices

## Step 6: Post-Deployment Checklist

- [ ] Custom domain configured and SSL active
- [ ] Environment variables set correctly
- [ ] Contact form sends emails successfully
- [ ] All pages load without errors
- [ ] SEO metadata appears correctly
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Social media preview cards work (test with [metatags.io](https://metatags.io))
- [ ] Analytics tracking (if configured)
- [ ] Mobile responsiveness verified
- [ ] Lighthouse score > 90

## Troubleshooting

### Build Fails

**Error**: `Module not found`
- **Solution**: Run `npm install` locally and ensure `package-lock.json` is committed

**Error**: `Type errors`
- **Solution**: Run `npm run build` locally to catch TypeScript errors

### Contact Form Not Working

**Error**: Email not sending
- **Solution**: 
  1. Verify `RESEND_API_KEY` is set in Vercel
  2. Check Resend domain verification
  3. Check Vercel function logs for errors

**Error**: 500 Internal Server Error
- **Solution**: Check Vercel function logs in Dashboard → Deployments → [Your Deployment] → Functions

### SEO Issues

**Sitemap not found**
- **Solution**: Ensure `app/sitemap.ts` exists and builds correctly

**Robots.txt not found**
- **Solution**: Ensure `app/robots.ts` exists

## Monitoring & Maintenance

1. **Vercel Analytics**: Enable in project settings for traffic insights
2. **Error Tracking**: Check Vercel function logs regularly
3. **Performance**: Monitor Core Web Vitals in Vercel dashboard
4. **Resend Logs**: Check email delivery status at [resend.com/emails](https://resend.com/emails)

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

To disable auto-deployment:
1. Go to **Settings** → **Git**
2. Configure deployment branches

## Security Best Practices

1. Never commit `.env.local` file
2. Rotate API keys periodically
3. Use environment-specific variables
4. Enable Vercel's security headers (already configured in `vercel.json`)
5. Monitor Resend API usage for anomalies

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start

# Deploy to Vercel
vercel --prod
```

---

**Last Updated**: November 2025
**Deployment Status**: Ready for production
