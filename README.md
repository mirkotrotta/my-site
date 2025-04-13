# Moon Site

A professional, feature-rich personal website template built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [FastAPI](https://fastapi.tiangolo.com/).

![Moon Site](https://github.com/mirkotrotta/moon-site.git/assets/preview.png)

## Overview

Moon Site is a comprehensive, production-ready template designed for developers, designers, and creative professionals who need a modern, customizable web presence. Built with a focus on performance, SEO, and developer experience, it provides everything you need to showcase your work, share content, and connect with potential clients or employers.

## Features

### Frontend (Next.js)
- **Modern React Development**: Built with Next.js 14+ and React 18+
- **Type Safety**: Full TypeScript support throughout the codebase
- **Responsive Design**: Looks perfect on all devices with mobile-first approach
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **SEO Optimized**: Meta tags, structured data, and sitemap generation
- **MDX Blog System**: Write posts in Markdown with JSX component support
- **Code Syntax Highlighting**: Beautiful code blocks for technical content
- **Image Optimization**: Automatic image optimization with Next.js Image
- **Fast Page Navigation**: Instant page transitions with prefetching
- **Dynamic Project Showcase**: GitHub integration to display your repositories
- **Customizable Skills Section**: Highlight your expertise and services

### Backend (FastAPI)
- **High-Performance API**: Async Python API built with FastAPI
- **GitHub Integration**: Automatic fetching of repository data
- **CORS Configured**: Ready for cross-origin requests
- **Easily Extensible**: Add your own endpoints for custom functionality
- **Resume API**: Built-in endpoint for serving resume data

## Directory Structure

```
moon-site/
├── frontend/             # Next.js frontend application
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable UI components
│   ├── content/          # MDX blog posts and other content
│   ├── lib/              # Utility functions and data
│   ├── public/           # Static assets (images, favicon, etc.)
│   └── scripts/          # Helper scripts for content management
│
├── backend/              # FastAPI backend application
│   ├── api/              # API routes and handlers
│   ├── models/           # Data models and schemas
│   └── requirements.txt  # Python dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- Python 3.8+
- Git

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/mirkotrotta/moon-site.git
cd moon-site
```

2. **Set up the backend**

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env file with your GitHub token
```

3. **Set up the frontend**

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your configuration
```

4. **Start the development servers**

```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev  # or yarn dev or pnpm dev
```

5. **Open your browser** to http://localhost:4000

## Customization Guide

### Personal Information

1. **Update Profile**
   - Edit `frontend/app/page.tsx` to modify the homepage content
   - Replace profile image in `frontend/public/images/`

2. **Skills & Services**
   - Edit `frontend/lib/data.tsx` to customize the skills section
   - Each skill can have a title, description, icon, and link

```tsx
export const skillsData: SkillOrService[] = [
  {
    title: 'Web Development',
    description: 'Building responsive and performant web applications',
    icon: <CodeIcon size={36} />,
    url: '/services/web-development'
  },
  // Add more skills here
];
```

3. **Projects**
   - Projects are automatically fetched from GitHub via the backend API
   - You can also manually define featured projects in `frontend/lib/data.tsx`

```tsx
export const featuredProjects: Project[] = [
  {
    name: 'Project Name',
    description: 'Project description goes here',
    url: 'https://github.com/username/repo',
    stars: 42,
    updated: '2023-10-22T15:30:00Z',
    language: 'TypeScript',
    topics: ['next.js', 'tailwind', 'featured']
  },
  // Add more projects here
];
```

### Blog Setup

1. **Create a new blog post**

```bash
cd frontend
npm run new-post "My Amazing Post Title"
```

This creates a new MDX file in `frontend/content/blog/` with the correct frontmatter.

2. **Blog post frontmatter**

```md
---
title: My Amazing Post Title
date: 2023-11-15
description: A short description of your post
tags: [next.js, react, web-dev]
image: /images/blog/my-post-cover.jpg
---

Your content goes here. You can use **Markdown** and also <Component />.
```

3. **Using components in MDX**
   - You can import and use React components in your blog posts
   - Custom components can be added in `frontend/components/mdx/`

### Theme Customization

1. **Colors and Typography**
   - Edit `frontend/tailwind.config.js` to change the color scheme and typography
   - The template uses Tailwind CSS for styling

2. **Layout and Structure**
   - Modify layout components in `frontend/app/layout.tsx`
   - Component styles are in their respective files using CSS modules or Tailwind

## Deployment

### Frontend (Next.js)

1. **Vercel** (recommended)
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the Next.js project

2. **Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command to `cd frontend && npm run build`
   - Set publish directory to `frontend/.next`

3. **Self-hosted**
   - Build the production version:
   ```bash
   cd frontend
   npm run build
   ```
   - Start the production server:
   ```bash
   npm start
   ```

### Backend (FastAPI)

1. **Railway or Render**
   - Connect your GitHub repository
   - Specify the build command: `pip install -r backend/requirements.txt`
   - Specify the start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Docker**
   - A Dockerfile is provided in the backend directory
   - Build and run the container:
   ```bash
   cd backend
   docker build -t moon-site-backend .
   docker run -p 8000:8000 -e GITHUB_TOKEN=your_token moon-site-backend
   ```

3. **Self-hosted (e.g., VPS)**
   - Install dependencies: `pip install -r backend/requirements.txt`
   - Run with Gunicorn for production:
   ```bash
   cd backend
   gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4 --bind 0.0.0.0:8000
   ```

## Extending the Template

### Adding New Pages

1. Add a new directory or file in `frontend/app/`:
   ```jsx
   // frontend/app/services/page.tsx
   export default function ServicesPage() {
     return (
       <main>
         <h1>My Services</h1>
         {/* Your content here */}
       </main>
     );
   }
   ```

### Adding API Endpoints

1. Create a new file in `backend/api/`:
   ```python
   # backend/api/newsletter.py
   from fastapi import APIRouter, Body
   
   router = APIRouter()
   
   @router.post("/subscribe")
   async def subscribe(email: str = Body(...)):
       # Your subscription logic here
       return {"status": "subscribed", "email": email}
   ```

2. Include the router in `main.py`:
   ```python
   from api import newsletter
   
   # Add this line with the other routers
   app.include_router(newsletter.router, prefix="/api/newsletter")
   ```

## Performance Optimization

This template is already optimized for performance, but here are some additional tips:

- Use Next.js Image component for all images to benefit from automatic optimization
- Enable ISR (Incremental Static Regeneration) for frequently updated pages
- Lazy load components and libraries that aren't needed immediately
- Use the built-in performance monitoring in Next.js Analytics

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests to improve this template.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created and maintained by [Mirko Trotta](https://github.com/mirkotrotta).

Icons provided by [Carbon Icons](https://github.com/carbon-design-system/carbon-icons).

## Support

Having trouble with Moon Site? Open an issue on GitHub or reach out directly.

---

Happy coding! 🚀
