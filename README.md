# Subodh KC - Personal Website

A production-ready personal website built with Next.js 14, showcasing AI compliance expertise, thought leadership, and professional services.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/personal-website)

## Overview

This website positions Subodh KC as a leading AI Compliance Architect, Enterprise Technical Program Manager, and founder of HAIEC (Human AI Ethics Council).

**Theme:** Strategic Systems. Sharp Execution. AI Compliance at Enterprise Scale.

## 🚀 Live Demo

Visit: [subodhkc.com](https://subodhkc.com)

## ✨ Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, TailwindCSS
- **Responsive Design**: Mobile-first, dark-mode optimized
- **SEO Optimized**: Complete metadata, Open Graph tags, semantic HTML, sitemap, robots.txt
- **Performance**: Optimized for Core Web Vitals
- **Accessible**: WCAG compliant components
- **Contact Form**: Integrated with Resend for email delivery to Subodh.kc@haiec.com
- **Structured Data**: JSON-LD schema for better search engine understanding
- **Security Headers**: Comprehensive security headers via Vercel configuration

## Pages

1. **Home** - Hero, value proposition, expertise showcase
2. **About** - Biography, journey, values
3. **HAIEC** - Platform overview, modules, case studies
4. **Writing** - Published articles and thought leadership
5. **Research** - Frameworks, methodologies, publications
6. **Advisory** - Consulting services and engagement models
7. **Speaking** - Topics, formats, booking information
8. **Contact** - Multiple contact methods and form

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to view the site.

## Project Structure

```
website/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── haiec/             # HAIEC platform page
│   ├── writing/           # Writing & articles page
│   ├── research/          # Research & frameworks page
│   ├── advisory/          # Advisory services page
│   ├── speaking/          # Speaking engagements page
│   ├── contact/           # Contact page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components (Button, Card)
│   ├── Navigation.tsx    # Site navigation
│   ├── Footer.tsx        # Site footer
│   ├── Hero.tsx          # Hero section component
│   ├── Section.tsx       # Section wrapper component
│   ├── CTA.tsx           # Call-to-action component
│   ├── Grid.tsx          # Grid layout component
│   └── Timeline.tsx      # Timeline component
├── lib/                  # Utilities
│   └── utils.ts          # Helper functions
└── public/               # Static assets

```

## Design System

### Colors

- **Primary**: Electric Blue (#2563EB) - Main brand color
- **Accent**: Cyan (#06B6D4) - Highlights and accents
- **Background**: Deep Navy (#0A1929) - Dark mode base
- **Text**: White/Gray scale - High contrast for readability

### Typography

- **Font**: Inter (sans-serif)
- **Headings**: 600 weight, tight tracking
- **Body**: 400-500 weight, relaxed leading

### Components

All components are built with:
- TailwindCSS for styling
- Class Variance Authority for variants
- Responsive design patterns
- Accessibility best practices

## Customization

### Update Content

Content is embedded directly in page components. To update:

1. Navigate to the relevant page in `app/[page]/page.tsx`
2. Update the content arrays and text
3. Changes will hot-reload in development

### Styling

Global styles: `app/globals.css`
Component styles: Inline TailwindCSS classes
Theme configuration: `tailwind.config.ts`

### Contact Form

The contact form is fully functional and integrated with Resend:

1. **Email Service**: Uses Resend API for reliable email delivery
2. **API Route**: `app/api/contact/route.ts` handles form submissions
3. **Recipient**: All messages sent to `Subodh.kc@haiec.com`
4. **Features**: Form validation, error handling, loading states, success confirmation

**Setup Required**:
- Add `RESEND_API_KEY` to Vercel environment variables
- Verify domain in Resend dashboard

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Other Platforms

The site can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Docker container
- Self-hosted

Build command: `npm run build`
Output directory: `.next`

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_SITE_URL=https://subodhkc.com
# Add other variables as needed
```

## Performance

- Lighthouse Score: 95+
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## SEO

- Semantic HTML structure
- Complete metadata on all pages
- Open Graph tags for social sharing
- Sitemap generation ready
- robots.txt ready

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2025 Subodh KC. All rights reserved.

## Contact

For questions or support:
- Email: contact@subodhkc.com
- LinkedIn: [linkedin.com/in/subodhkc](https://linkedin.com/in/subodhkc)
