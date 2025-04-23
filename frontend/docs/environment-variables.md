# Environment Variables

This document lists all environment variables used in the application.

## Required Environment Variables

Create a `.env.local` file in the root of the frontend directory with these variables:

```
# Site URL (used for metadata and Open Graph images)
NEXT_PUBLIC_SITE_URL=https://mirkotrotta.com

# Buttondown Newsletter API Key
# Get this from https://buttondown.email/settings/api
BUTTONDOWN_API_KEY=your_buttondown_api_key_here

# Formspree Contact Form Endpoint
# Get this from https://formspree.io after creating a form
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id_here
```

## Optional Environment Variables

These variables are optional but enhance certain functionality:

```
# Analytics (if needed)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FATHOM_SITE_ID=XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID=XXXXXXXXXX
```

## Development Setup

For local development, you can create a `.env.local` with placeholder or testing values:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BUTTONDOWN_API_KEY=test_12345
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/test
```

## Setting Environment Variables in Production

In production environments, set these variables according to your hosting platform:

- Vercel: Use the Environment Variables section in your project settings
- Netlify: Use the Environment Variables section in your site settings
- Docker: Pass environment variables using the `-e` flag or in docker-compose.yml 