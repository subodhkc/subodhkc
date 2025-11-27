# Deployment Checklist for subodhkc.com

## Pre-Deployment

### 1. Code Quality
- [ ] All TypeScript errors resolved (`npm run build` succeeds)
- [ ] No console errors or warnings
- [ ] All lint issues addressed (`npm run lint`)
- [ ] Code reviewed and tested locally

### 2. Environment Variables
- [ ] `.env.example` updated with all required variables
- [ ] `.env.local` created for local development (not committed)
- [ ] All environment variables documented

### 3. Content Review
- [ ] All text content proofread
- [ ] Contact email verified: `Subodh.kc@haiec.com`
- [ ] All links tested and working
- [ ] Images optimized and loading correctly
- [ ] Professional tone maintained throughout

### 4. SEO Preparation
- [ ] Meta titles and descriptions reviewed
- [ ] Open Graph tags configured
- [ ] Twitter card metadata set
- [ ] Sitemap generated (`/sitemap.xml`)
- [ ] Robots.txt configured (`/robots.txt`)
- [ ] Structured data (JSON-LD) implemented

## Vercel Setup

### 1. Account & Project
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project imported to Vercel
- [ ] Framework preset: Next.js selected

### 2. Environment Variables in Vercel
Add these in **Settings → Environment Variables**:

**Production:**
- [ ] `RESEND_API_KEY` = `re_xxxxx` (from Resend)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://subodhkc.com`

**Preview:**
- [ ] `RESEND_API_KEY` = `re_xxxxx` (same as production)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://preview-url.vercel.app`

**Optional (if using):**
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXT_PUBLIC_GA_ID`

### 3. Build Configuration
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`
- [ ] Root Directory: `./` (or appropriate path)

## Resend Configuration

### 1. Account Setup
- [ ] Resend account created at [resend.com](https://resend.com)
- [ ] API key generated
- [ ] API key added to Vercel environment variables

### 2. Domain Verification
- [ ] Domain added in Resend dashboard
- [ ] DNS records configured:
  - [ ] SPF record
  - [ ] DKIM record
  - [ ] DMARC record (optional but recommended)
- [ ] Domain verification status: ✅ Verified
- [ ] Test email sent successfully

### 3. Email Configuration
- [ ] Sender email: `noreply@subodhkc.com`
- [ ] Recipient email: `Subodh.kc@haiec.com`
- [ ] Email template reviewed and tested

## Domain Configuration

### 1. DNS Settings
- [ ] Domain purchased/available
- [ ] DNS provider accessible
- [ ] A record: `@` → Vercel IP
- [ ] CNAME record: `www` → `cname.vercel-dns.com`
- [ ] DNS propagation complete (check with [whatsmydns.net](https://whatsmydns.net))

### 2. Vercel Domain Setup
- [ ] Custom domain added in Vercel
- [ ] SSL certificate issued (automatic)
- [ ] HTTPS redirect enabled
- [ ] www redirect configured (if desired)

## Testing

### 1. Functional Testing
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Email received at `Subodh.kc@haiec.com`
- [ ] Form validation works
- [ ] Error handling displays correctly
- [ ] Success message appears after submission

### 2. SEO Testing
- [ ] `/sitemap.xml` accessible
- [ ] `/robots.txt` accessible
- [ ] Meta tags appear in page source
- [ ] Open Graph preview works (test at [metatags.io](https://metatags.io))
- [ ] Twitter card preview works
- [ ] Structured data valid (test at [schema.org validator](https://validator.schema.org))

### 3. Performance Testing
- [ ] Lighthouse audit run (target: 90+ score)
  - [ ] Performance: 90+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+
- [ ] Core Web Vitals checked
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Mobile performance verified
- [ ] Page load speed acceptable

### 4. Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 5. Responsive Design Testing
- [ ] Desktop (1920px+)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Small mobile (320px)

### 6. Security Testing
- [ ] HTTPS working correctly
- [ ] Security headers present (check at [securityheaders.com](https://securityheaders.com))
- [ ] No sensitive data exposed in client-side code
- [ ] API routes protected
- [ ] Rate limiting considered for contact form

## Post-Deployment

### 1. Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Uptime monitoring (optional)
- [ ] Performance monitoring active

### 2. Search Engine Submission
- [ ] Google Search Console
  - [ ] Property added
  - [ ] Sitemap submitted
  - [ ] Ownership verified
- [ ] Bing Webmaster Tools
  - [ ] Site added
  - [ ] Sitemap submitted

### 3. Social Media
- [ ] LinkedIn profile updated with website
- [ ] Twitter profile updated with website
- [ ] Social media preview cards tested
- [ ] Share buttons working (if applicable)

### 4. Analytics (Optional)
- [ ] Google Analytics configured
- [ ] Tracking code verified
- [ ] Goals/events set up
- [ ] Privacy policy updated (if collecting data)

### 5. Documentation
- [ ] README.md updated with live URL
- [ ] Deployment guide reviewed
- [ ] Team members informed (if applicable)
- [ ] Credentials securely stored

## Maintenance

### Regular Tasks
- [ ] Weekly: Check Resend email logs
- [ ] Weekly: Review Vercel function logs
- [ ] Monthly: Review analytics
- [ ] Monthly: Check for dependency updates
- [ ] Quarterly: Security audit
- [ ] Quarterly: Content review and updates

### Emergency Contacts
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Resend Support**: [resend.com/support](https://resend.com/support)
- **Domain Registrar**: [Your registrar support]

## Rollback Plan

If issues occur:
1. Check Vercel deployment logs
2. Review recent commits in GitHub
3. Rollback to previous deployment in Vercel dashboard
4. Fix issues locally and redeploy
5. Monitor error logs

## Success Criteria

Deployment is successful when:
- ✅ Website accessible at `https://subodhkc.com`
- ✅ All pages load without errors
- ✅ Contact form sends emails successfully
- ✅ SEO elements present and valid
- ✅ Performance scores meet targets
- ✅ Mobile experience is smooth
- ✅ Security headers configured
- ✅ Analytics tracking (if configured)

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Version**: 1.0.0
**Status**: ⬜ Ready | ⬜ In Progress | ⬜ Complete
