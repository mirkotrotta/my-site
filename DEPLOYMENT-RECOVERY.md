# Production Deployment Recovery Guide

This guide provides a comprehensive approach to recovering from a broken deployment on Oracle Cloud and establishing a clean, reproducible deployment process.

## 🔍 Current Setup Analysis

Based on your project structure, here's what I found:

### Deployment Architecture
- **Production**: Uses `docker-compose.prod.yml` with Traefik, SSL, and Watchtower
- **Development**: Uses `docker-compose.yml` for local development
- **CI/CD**: GitHub Actions build and push images to GHCR, then deploy via SSH
- **Images**: Built as `ghcr.io/mirkotrotta/my-site/my-site-web:latest` and `my-site-api:latest`

### Potential Issues Identified

1. **Missing Environment Configuration**
   - No `.env.production` file in repository (correctly ignored)
   - Environment variables may be missing on production server

2. **Docker Volume Management**
   - Traefik ACME certificates stored in `data/traefik/acme/`
   - Potential for orphaned volumes from previous deployments

3. **Container Naming Conflicts**
   - Previous deployments may have left containers running
   - Network conflicts possible

4. **Image Synchronization**
   - Production server may have outdated images
   - Build cache issues possible

## 🛠️ Step-by-Step Recovery Process

### Phase 1: Audit Current State

Run the audit script to understand the current state:

**On Windows (locally):**
```powershell
.\scripts\production-audit.ps1
```

**On Oracle Cloud server:**
```bash
# SSH into your server first
ssh ubuntu@your-server-ip

# Navigate to project directory
cd ~/my-site

# Run the audit (if you have the bash version)
./scripts/production-audit.sh
```

### Phase 2: Backup Critical Data

Before making any changes, backup important data:

```bash
# Create backup directory
mkdir -p backup-$(date +%Y%m%d)

# Backup Traefik certificates (if they exist)
if [ -f "data/traefik/acme/acme.json" ]; then
    cp -r data/traefik/acme backup-$(date +%Y%m%d)/
fi

# Backup any custom configuration
cp .env.production backup-$(date +%Y%m%d)/ 2>/dev/null || echo "No .env.production found"

# Export current logs
docker compose -f docker-compose.prod.yml logs > backup-$(date +%Y%m%d)/logs.txt 2>/dev/null || echo "No running containers"
```

### Phase 3: Clean Deployment

#### Option A: Automated Clean Deployment (Recommended)

Use the provided clean deployment script:

```bash
./scripts/clean-deploy.sh
```

#### Option B: Manual Clean Deployment

1. **Stop and remove current deployment:**
   ```bash
   docker compose -f docker-compose.prod.yml down
   ```

2. **Clean up Docker resources:**
   ```bash
   # Remove stopped containers
   docker container prune -f
   
   # Remove unused images
   docker image prune -f
   
   # Remove unused volumes (be careful!)
   docker volume prune -f
   
   # Remove unused networks
   docker network prune -f
   ```

3. **Ensure repository is up to date:**
   ```bash
   git fetch origin main
   git reset --hard origin/main
   ```

4. **Create/verify environment file:**
   ```bash
   # Create .env.production with required variables
   cat > .env.production << EOF
   DOMAIN=mirkotrotta.com
   ACME_EMAIL=your-email@example.com
   GITHUB_REPOSITORY=mirkotrotta/my-site
   DOCKER_REGISTRY=ghcr.io
   TAG=latest
   NOTIFICATION_URL=
   EOF
   ```

5. **Create required directories:**
   ```bash
   mkdir -p data/traefik/acme
   chmod 600 data/traefik/acme
   ```

6. **Pull latest images:**
   ```bash
   docker compose -f docker-compose.prod.yml pull
   ```

7. **Deploy:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

8. **Verify deployment:**
   ```bash
   # Check container status
   docker compose -f docker-compose.prod.yml ps
   
   # Check logs
   docker compose -f docker-compose.prod.yml logs -f
   ```

## 🎭 Staging Environment Setup

To prevent future production issues, use the staging environment:

### Local Staging Setup

1. **Start staging environment:**
   ```bash
   # On Windows
   .\scripts\setup-staging.ps1
   
   # On Linux/macOS
   ./scripts/setup-staging.sh
   ```

2. **Access staging:**
   - Frontend: http://localhost:4001
   - API: http://localhost:8001
   - Traefik Dashboard: http://localhost:8080

3. **Test changes:**
   ```bash
   # View staging logs
   docker compose -f docker-compose.staging.yml logs -f
   
   # Stop staging
   docker compose -f docker-compose.staging.yml down
   ```

### Server-Side Staging

You can also run staging on your Oracle Cloud server:

```bash
# On the server
docker compose -f docker-compose.staging.yml up -d

# Access via server IP
# Frontend: http://your-server-ip:4001
# API: http://your-server-ip:8001
```

## 🔧 Environment Configuration

### Required Environment Variables

Create `.env.production` on your server with these variables:

```bash
# Domain Configuration
DOMAIN=mirkotrotta.com
ACME_EMAIL=your-email@example.com

# Container Registry
GITHUB_REPOSITORY=mirkotrotta/my-site
DOCKER_REGISTRY=ghcr.io
TAG=latest

# Notifications (optional)
NOTIFICATION_URL=

# Add any application-specific variables here
```

### Security Considerations

1. **Never commit `.env.production` to git**
2. **Use strong, unique values for any secrets**
3. **Regularly rotate API keys and certificates**
4. **Monitor certificate expiration**

## 🚀 Improved Deployment Workflow

### For Future Deployments

1. **Test locally first:**
   ```bash
   # Test with development setup
   docker compose up -d
   
   # Or test with staging
   docker compose -f docker-compose.staging.yml up -d
   ```

2. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```

3. **GitHub Actions will automatically:**
   - Build new images
   - Push to GitHub Container Registry
   - Deploy to production via SSH

4. **Monitor deployment:**
   ```bash
   # Check GitHub Actions
   # Monitor server logs
   docker compose -f docker-compose.prod.yml logs -f
   ```

## 🔍 Troubleshooting Common Issues

### Issue: Containers won't start
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs

# Check system resources
docker system df
df -h

# Check for port conflicts
netstat -tuln | grep -E ":(80|443|4000|8000)"
```

### Issue: SSL certificates not working
```bash
# Check Traefik logs
docker compose -f docker-compose.prod.yml logs traefik

# Verify ACME directory permissions
ls -la data/traefik/acme/

# Check domain DNS
nslookup mirkotrotta.com
```

### Issue: Images not updating
```bash
# Force pull latest images
docker compose -f docker-compose.prod.yml pull

# Remove old images
docker image prune -a

# Restart deployment
docker compose -f docker-compose.prod.yml up -d --force-recreate
```

### Issue: GitHub Actions failing
1. Check repository secrets are set correctly
2. Verify SSH key has proper permissions
3. Check server disk space and Docker daemon status

## 📋 Maintenance Checklist

### Weekly
- [ ] Check container health: `docker compose -f docker-compose.prod.yml ps`
- [ ] Review logs for errors: `docker compose -f docker-compose.prod.yml logs --tail=100`
- [ ] Check disk space: `df -h`

### Monthly
- [ ] Update base images and rebuild
- [ ] Review and rotate secrets if needed
- [ ] Check SSL certificate expiration
- [ ] Clean up unused Docker resources

### Before Major Changes
- [ ] Test in staging environment
- [ ] Backup current state
- [ ] Plan rollback strategy
- [ ] Monitor deployment closely

## 🆘 Emergency Rollback

If something goes wrong:

1. **Quick rollback:**
   ```bash
   # Stop current deployment
   docker compose -f docker-compose.prod.yml down
   
   # Restore from backup
   cp backup-YYYYMMDD/acme/* data/traefik/acme/
   
   # Start with previous configuration
   docker compose -f docker-compose.prod.yml up -d
   ```

2. **Rollback to previous image:**
   ```bash
   # Find previous image tag
   docker images | grep my-site
   
   # Update TAG in .env.production
   echo "TAG=previous-tag" >> .env.production
   
   # Redeploy
   docker compose -f docker-compose.prod.yml up -d
   ```

## 📞 Support Resources

- **Docker Compose Reference**: https://docs.docker.com/compose/
- **Traefik Documentation**: https://doc.traefik.io/traefik/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Oracle Cloud**: https://docs.oracle.com/en-us/iaas/

---

**Remember**: Always test changes in staging before deploying to production! 