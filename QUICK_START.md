# Quick Start Guide - subodhkc.com

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd personal-website
npm install
```

### Step 2: Set Up Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Resend API key:

```env
RESEND_API_KEY=re_your_actual_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📧 Setting Up Email (Resend)

### 1. Create Resend Account
- Go to [resend.com](https://resend.com)
- Sign up for free account
- Verify your email

### 2. Get API Key
- Navigate to [API Keys](https://resend.com/api-keys)
- Click "Create API Key"
- Name it "Personal Website"
- Copy the key (starts with `re_`)
- Add to `.env.local`

### 3. Verify Domain (For Production)
- Go to [Domains](https://resend.com/domains)
- Add `subodhkc.com`
- Add DNS records to your domain provider:
  - SPF record
  - DKIM record
- Wait for verification (usually 5-10 minutes)

### 4. Test Contact Form
- Run dev server
- Go to `/contact`
- Fill out form
- Check email at `Subodh.kc@haiec.com`

---

## 🌐 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/personal-website)

### Option 2: Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Add Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `RESEND_API_KEY` = your Resend API key
   - `NEXT_PUBLIC_SITE_URL` = `https://subodhkc.com`

---

## ✅ Verify Everything Works

### Local Testing
- [ ] Homepage loads at `http://localhost:3000`
- [ ] All pages accessible
- [ ] Contact form submits
- [ ] Email received

### Production Testing
- [ ] Site accessible at `https://subodhkc.com`
- [ ] SSL certificate active (🔒 in browser)
- [ ] Contact form works
- [ ] Sitemap: `https://subodhkc.com/sitemap.xml`
- [ ] Robots: `https://subodhkc.com/robots.txt`

---

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Deployment
vercel               # Deploy to preview
vercel --prod        # Deploy to production
```

---

## 📝 Next Steps

1. **Customize Content**: Update text in page files under `/app`
2. **Add Analytics**: Configure Google Analytics (optional)
3. **SEO Optimization**: Submit sitemap to Google Search Console
4. **Monitor**: Enable Vercel Analytics for traffic insights

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Contact Form Not Working
1. Check `RESEND_API_KEY` is set
2. Verify domain in Resend dashboard
3. Check Vercel function logs

### TypeScript Errors
```bash
# Check for errors
npm run build

# Fix common issues
npm install --save-dev @types/node @types/react @types/react-dom
```

---

## 📚 Documentation

- **Full Deployment Guide**: See `VERCEL_DEPLOYMENT.md`
- **Deployment Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Project Details**: See `README.md`

---

## 💡 Tips

- **Development**: Use `npm run dev` for hot reload
- **Production Build**: Always test with `npm run build` before deploying
- **Environment Variables**: Never commit `.env.local` to Git
- **Email Testing**: Use Resend sandbox mode for testing
- **Performance**: Run Lighthouse audit regularly

---

**Need Help?**
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Resend Docs: [resend.com/docs](https://resend.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
