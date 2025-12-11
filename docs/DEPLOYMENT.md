# Deployment Guide

## Overview

This guide covers deploying Entoo2 to production environments. The application is designed to run on Docker with optional cloud provider integration.

## Deployment Options

1. **Self-hosted (Docker Compose)** - Single server deployment
2. **Azure Container Apps** - Managed container platform
3. **Kubernetes** - For larger scale deployments

## Prerequisites

- Docker 24+ and Docker Compose v2
- Domain name (optional, but recommended)
- SSL certificate (auto-generated with Let's Encrypt)
- Minimum 4GB RAM, 2 CPU cores, 50GB storage

## Self-Hosted Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 2. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/P3chys/entoo2-infra.git
sudo chown -R $USER:$USER entoo2-infra
cd entoo2-infra
```

### 3. Configure Environment

```bash
# Copy and edit environment file
cp docker/.env.example docker/.env
nano docker/.env
```

**Production .env settings:**

```bash
# Database - use strong passwords!
POSTGRES_USER=entoo2
POSTGRES_PASSWORD=<generate-strong-password>
POSTGRES_DB=entoo2

# Redis
REDIS_PASSWORD=<generate-strong-password>

# MinIO
MINIO_ROOT_USER=entoo2admin
MINIO_ROOT_PASSWORD=<generate-strong-password>

# Meilisearch
MEILI_MASTER_KEY=<generate-strong-key>

# JWT
JWT_SECRET=<generate-strong-secret>

# Environment
APP_ENV=production
```

Generate secure passwords:
```bash
openssl rand -base64 32
```

### 4. Configure Domain (Optional)

Edit `config/traefik/traefik.yml`:

```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com  # Change this
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
```

Update Traefik labels in `docker/docker-compose.yml`:

```yaml
labels:
  - "traefik.http.routers.frontend.rule=Host(`your-domain.com`)"
  - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
```

### 5. Build and Deploy

```bash
# Build images
docker compose -f docker/docker-compose.yml build

# Start all services
docker compose -f docker/docker-compose.yml up -d

# Check status
docker compose -f docker/docker-compose.yml ps

# View logs
docker compose -f docker/docker-compose.yml logs -f
```

### 6. Run Migrations

```bash
# Run database migrations
docker exec entoo2-backend ./migrate up
```

### 7. Create Admin User

The first admin user is created via database seed or:

```bash
docker exec -it entoo2-postgres psql -U entoo2 -d entoo2
```

```sql
-- Create admin (use bcrypt hash for password)
INSERT INTO users (email, password_hash, role, display_name)
VALUES ('admin@yourdomain.com', '<bcrypt-hash>', 'admin', 'Administrator');
```

## Backup & Recovery

### Automated Backups

Create backup script at `/opt/entoo2-infra/scripts/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/entoo2"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
docker exec entoo2-postgres pg_dump -U entoo2 -d entoo2 \
  -F c -f /tmp/backup.dump
docker cp entoo2-postgres:/tmp/backup.dump \
  $BACKUP_DIR/db_$DATE.dump

# MinIO backup (document files)
docker run --rm -v minio-data:/data \
  -v $BACKUP_DIR:/backup alpine \
  tar czf /backup/minio_$DATE.tar.gz /data

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

Schedule with cron:
```bash
0 2 * * * /opt/entoo2-infra/scripts/backup.sh >> /var/log/entoo2-backup.log 2>&1
```

### Restore from Backup

```bash
# Stop services
docker compose -f docker/docker-compose.yml stop backend frontend

# Restore database
docker cp backup.dump entoo2-postgres:/tmp/
docker exec entoo2-postgres pg_restore -U entoo2 -d entoo2 -c /tmp/backup.dump

# Restore MinIO data
docker run --rm -v minio-data:/data \
  -v /path/to/backup:/backup alpine \
  tar xzf /backup/minio_backup.tar.gz -C /

# Start services
docker compose -f docker/docker-compose.yml start backend frontend
```

## Monitoring

### Health Checks

All services have built-in health checks. Monitor with:

```bash
# Service health
docker compose -f docker/docker-compose.yml ps

# Individual service health
curl http://localhost:8000/health  # API
curl http://localhost:7700/health  # Meilisearch
curl http://localhost:9000/minio/health/live  # MinIO
```

### Log Management

```bash
# View all logs
docker compose -f docker/docker-compose.yml logs -f

# View specific service
docker compose -f docker/docker-compose.yml logs -f backend

# Export logs
docker compose -f docker/docker-compose.yml logs --no-color > logs.txt
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## Scaling

### Horizontal Scaling (API)

Modify `docker/docker-compose.yml`:

```yaml
backend:
  deploy:
    replicas: 3
```

### Vertical Scaling

Adjust resource limits:

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        cpus: '0.5'
        memory: 512M
```

## Security Hardening

### 1. Firewall Rules

```bash
# Allow only necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Secure Headers

Already configured in Traefik dynamic config. Verify with:

```bash
curl -I https://your-domain.com
```

### 3. Rate Limiting

Configured in `config/traefik/dynamic/routes.yml`. Adjust as needed:

```yaml
ratelimit:
  rateLimit:
    average: 100
    burst: 50
```

### 4. Regular Updates

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update containers
docker compose -f docker/docker-compose.yml pull
docker compose -f docker/docker-compose.yml up -d
```

## Troubleshooting

### Common Issues

**Services won't start:**
```bash
docker compose -f docker/docker-compose.yml logs [service-name]
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml up -d
```

**Database connection issues:**
```bash
docker exec entoo2-postgres pg_isready -U entoo2
docker logs entoo2-postgres
```

**Out of disk space:**
```bash
docker system prune -a  # WARNING: Removes unused images
docker volume prune     # WARNING: Removes unused volumes
```

**High memory usage:**
```bash
docker stats
# Restart specific service
docker compose -f docker/docker-compose.yml restart [service]
```

## Azure Deployment (Future)

For Azure Container Apps deployment, see the separate Azure deployment guide (to be created).

Key considerations:
- Use Azure PostgreSQL Flexible Server
- Use Azure Cache for Redis
- Use Azure Blob Storage instead of MinIO
- Configure Azure Front Door or Application Gateway
