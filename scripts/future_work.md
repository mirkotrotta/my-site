# Future Work for my-site

## New Features
- Add and adapt "Home" page with my information
- Add and adapt "About" page with my information
- Add and adapt "Resume" page with my information
- Remove blog posts from the template, start adding my blog posts. At least 3
- Create contact page
- Add multilanguage to the site using i18n: set German as default, English as fallback, then add Spanish and Italian
- Add a better blog card to the homepage (component exists)
- Add the Button component to all the pages
- Automate blog post creation from Obsidian markdown
- Add animations using Framer Motion

## Bug Fixes
- Fix container on blog posts on mobile (excessive side padding)
- Hero component `HeroWithSidebar.tsx` is not responsive, needs fix

## Technical Debt
- Add/Improve unit, integration, and E2E tests (Jest, Cypress)
- Security enhancements: headers, CORS, rate limits, OWASP audits
- Refactor and clean UI components for better reusability
- Replace hardcoded values and improve type safety
- Add multilingual sitemap and robots.txt

## DevOps/Infra
- Dockerize frontend and backend
- Setup CI/CD with GitHub Actions
- Form integrations (e.g. email, backend, validation)
- Add analytics (e.g. Plausible)
- Lighthouse, SEO, Web Vitals optimization
- Domain + SSL setup
- Monitor performance/logs (e.g. Vercel, Railway, UptimeRobot)
- Integrate type checking, linting, formatting into CI
- Add OpenGraph meta and structured data
- Enable security headers, rate limiting, CSP, CORS

