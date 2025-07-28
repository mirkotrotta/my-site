# Mirko Trotta - Portfolio Website

My personal portfolio website built with modern web technologies and deployed to production with automated CI/CD.

🌐 **Live Site**: [https://mirkotrotta.com](https://mirkotrotta.com)

---

## About

A full-stack web application showcasing my development skills and professional experience. Features a multilingual design (English/German), dynamic blog system, and contact functionality.

**Key Features:**
- Multilingual support with internationalization
- Responsive design for all devices
- Contact form with email integration
- Blog system with markdown content
- Project showcase and resume sections
- Production deployment with SSL and monitoring

---

## Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, React Hook Form, Framer Motion  
**Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy, Pydantic  
**Infrastructure:** Docker, Hetzner Cloud, Nginx Proxy Manager, Let's Encrypt  
**Tools:** GitHub Actions CI/CD, ESLint, Prettier, Zod validation

---

## Architecture

**Frontend:** Next.js app with server-side rendering and static generation  
**Backend:** FastAPI REST API with automatic OpenAPI documentation  
**Database:** PostgreSQL with SQLAlchemy ORM for type safety  
**Deployment:** Dockerized application with automated CI/CD pipeline  
**Security:** HTTPS, input validation, CORS protection, security headers

---

## Features

- **Multilingual Support** - English and German versions
- **Dynamic Blog** - Markdown-based content management
- **Contact System** - Form with email integration
- **Project Gallery** - Showcase of development work
- **Resume Section** - Professional experience and skills
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags, sitemaps, structured data
- **Performance** - Image optimization and lazy loading

## Development

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mirkotrotta/my-site.git
   cd my-site
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.docker.example .env.docker
   # Edit .env.docker with your local settings
   ```

3. **Start development environment**:
   
   **Windows (PowerShell)**:
   ```powershell
   .\manage.ps1 -Command start
   ```
   
   **macOS/Linux**:
   ```bash
   make dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:4000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Development Commands

**Windows (PowerShell)**:
```powershell
.\manage.ps1 -Command start    # Start development environment
.\manage.ps1 -Command stop     # Stop development environment
.\manage.ps1 -Command logs     # View logs
.\manage.ps1 -Command help     # Show all commands
```

**macOS/Linux**:
```bash
make dev                       # Start development environment
make dev-down                  # Stop development environment
make dev-logs                  # View logs
make help                      # Show all commands
```

For detailed development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).

---

## Deployment

Automated deployment using GitHub Actions CI/CD pipeline:
- Docker containerization
- Deployment to Hetzner Cloud VPS
- SSL certificates with Let's Encrypt
- Nginx reverse proxy
- Zero-downtime deployments

### Production Stack

The production environment runs a 6-service Docker stack:
- **Web** (Next.js frontend)
- **API** (FastAPI backend)
- **Database** (PostgreSQL)
- **Nginx Proxy Manager** (SSL termination & reverse proxy)
- **Watchtower** (automatic container updates)
- **Netdata** (system monitoring)

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Contact

**Mirko Trotta**  
Full-Stack Developer

- 🌐 Website: [mirkotrotta.com](https://mirkotrotta.com)
- 💼 LinkedIn: [linkedin.com/in/mirkotrotta](https://linkedin.com/in/mirkotrotta)
- 📧 Email: [hello@mirkotrotta.com](mailto:hello@mirkotrotta.com)
- 📱 GitHub: [github.com/mirkotrotta](https://github.com/mirkotrotta)

---

*This project demonstrates modern full-stack development skills including React, TypeScript, FastAPI, PostgreSQL, Docker, and DevOps practices. Open to discussing development opportunities and collaborations.*
