# Entoo2 Deployment Setup

Complete setup guide for deploying Entoo2 to Hetzner.

## Prerequisites

- Hetzner server (Ubuntu 22.04+)
- GitHub account with access to P3chys repositories
- SSH access to server

## Setup Steps

### 1. Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "github-actions-entoo2" -f ~/.ssh/entoo2_deploy
```

### 2. Add SSH Key to Hetzner Server

In Hetzner web console, run:

```bash
echo 'YOUR_PUBLIC_KEY_HERE' >> ~/.ssh/authorized_keys
```

Or get your public key:
```bash
cat ~/.ssh/entoo2_deploy.pub
```

### 3. Configure GitHub Secrets

Add to **ALL THREE** repositories (entoo2-infra, entoo2-api, entoo2-web):

Go to: `Settings → Secrets and variables → Actions → New repository secret`

Add these 3 secrets:

| Name | Value |
|------|-------|
| `SSH_HOST` | Your server IP (e.g., `46.224.113.48`) |
| `SSH_USER` | `root` |
| `SSH_PRIVATE_KEY` | Output of `cat ~/.ssh/entoo2_deploy` |

**Links:**
- https://github.com/P3chys/entoo2-infra/settings/secrets/actions
- https://github.com/P3chys/entoo2-api/settings/secrets/actions
- https://github.com/P3chys/entoo2-web/settings/secrets/actions

### 4. Enable GitHub Actions Permissions

For **ALL THREE** repositories:

`Settings → Actions → General → Workflow permissions`
- Select: **"Read and write permissions"**
- Click **Save**

**Links:**
- https://github.com/P3chys/entoo2-infra/settings/actions
- https://github.com/P3chys/entoo2-api/settings/actions
- https://github.com/P3chys/entoo2-web/settings/actions

### 5. Run Setup Workflow

1. Go to: https://github.com/P3chys/entoo2-infra/actions
2. Click **"Setup Hetzner Server"**
3. Click **"Run workflow"**
4. Enter your server IP
5. Click **"Run workflow"**

⏳ Wait 5-10 minutes for completion.

### 6. Access Your Application

- **Frontend**: http://YOUR_SERVER_IP
- **API**: http://YOUR_SERVER_IP:8000

**Default Login:**
```
Email: admin@entoo2.local
Password: AdminPass123!
```

## Future Deployments

### Deploy API Updates

1. Go to: https://github.com/P3chys/entoo2-api/actions
2. Click **"Deploy to Hetzner"**
3. Click **"Run workflow"** → Select **"production"**

### Deploy Web Updates

1. Go to: https://github.com/P3chys/entoo2-web/actions
2. Click **"Deploy to Hetzner"**
3. Click **"Run workflow"** → Select **"production"**

## Manual Operations

### SSH into Server

```bash
ssh -i ~/.ssh/entoo2_deploy root@YOUR_SERVER_IP
```

### View Logs

```bash
cd /opt/entoo2
docker compose logs -f              # All services
docker compose logs -f frontend     # Frontend only
docker compose logs -f backend      # Backend only
```

### Restart Services

```bash
cd /opt/entoo2
docker compose restart              # All services
docker compose restart frontend     # Frontend only
docker compose restart backend      # Backend only
```

### Update Environment Variables

```bash
ssh -i ~/.ssh/entoo2_deploy root@YOUR_SERVER_IP
nano /opt/entoo2/.env
# Make changes
cd /opt/entoo2
docker compose up -d                # Restart with new config
```

### Backup Database

```bash
ssh -i ~/.ssh/entoo2_deploy root@YOUR_SERVER_IP
/opt/entoo2/backup.sh
# Backups stored in: /opt/entoo2/backups/
```

Auto backups run daily at 2 AM.

### Check Service Status

```bash
ssh -i ~/.ssh/entoo2_deploy root@YOUR_SERVER_IP
cd /opt/entoo2
docker compose ps
```

## Troubleshooting

### Services Won't Start

```bash
cd /opt/entoo2
docker compose down
docker compose up -d
docker compose logs -f
```

### Application Not Accessible

```bash
# Check firewall
ufw status

# Check if ports are open
ufw allow 80/tcp
ufw allow 8000/tcp

# Test locally
curl http://localhost        # Frontend
curl http://localhost:8000   # Backend
```

### Out of Disk Space

```bash
docker system prune -a       # Remove unused images
docker volume prune          # Remove unused volumes
```

### Reset Everything

```bash
cd /opt/entoo2
docker compose down -v       # ⚠️ Deletes all data
docker compose up -d
```

## Security Recommendations

1. **Change Default Passwords**
   ```bash
   ssh root@SERVER_IP
   nano /opt/entoo2/.env
   # Change all passwords
   cd /opt/entoo2 && docker compose up -d
   ```

2. **Use Strong Passwords**
   ```bash
   openssl rand -base64 32
   ```

3. **Disable Root SSH** (after setup)
   ```bash
   # Create new user
   adduser deploy
   usermod -aG sudo deploy
   # Add SSH key to new user
   # Disable root login in /etc/ssh/sshd_config
   ```

4. **Enable Fail2ban**
   ```bash
   apt install fail2ban
   systemctl enable fail2ban
   ```

## File Structure on Server

```
/opt/entoo2/
├── docker-compose.yml    # Service configuration
├── .env                  # Environment variables
├── backups/             # Database backups
└── backup.sh            # Backup script
```

## Quick Reference

| Action | Command |
|--------|---------|
| SSH | `ssh -i ~/.ssh/entoo2_deploy root@SERVER_IP` |
| Logs | `cd /opt/entoo2 && docker compose logs -f` |
| Restart | `cd /opt/entoo2 && docker compose restart` |
| Status | `cd /opt/entoo2 && docker compose ps` |
| Backup | `ssh root@SERVER_IP /opt/entoo2/backup.sh` |

## Support

- Full documentation: `DEPLOYMENT.md`
- Issues: https://github.com/P3chys/entoo2-infra/issues
