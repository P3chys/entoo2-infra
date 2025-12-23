#!/bin/bash

# Entoo2 Hetzner Server Setup Script
# This script prepares a fresh Ubuntu server for Entoo2 deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}Entoo2 Server Setup Script${NC}"
echo -e "${GREEN}=================================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${YELLOW}Installing required packages...${NC}"
apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    gnupg \
    lsb-release \
    ufw

# Install Docker
echo -e "${YELLOW}Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl start docker
    systemctl enable docker
    echo -e "${GREEN}Docker installed successfully${NC}"
else
    echo -e "${GREEN}Docker is already installed${NC}"
fi

# Verify Docker installation
docker --version
docker compose version

# Create deployment user (optional)
read -p "Do you want to create a 'deploy' user? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if id "deploy" &>/dev/null; then
        echo -e "${GREEN}User 'deploy' already exists${NC}"
    else
        echo -e "${YELLOW}Creating deploy user...${NC}"
        adduser --disabled-password --gecos "" deploy
        usermod -aG docker deploy
        usermod -aG sudo deploy
        echo -e "${GREEN}User 'deploy' created${NC}"
    fi
fi

# Create deployment directory
echo -e "${YELLOW}Creating deployment directory...${NC}"
mkdir -p /opt/entoo2/{config/traefik/{dynamic},backups}
chown -R root:root /opt/entoo2

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw status

# Setup log rotation
echo -e "${YELLOW}Setting up log rotation...${NC}"
cat > /etc/logrotate.d/docker-containers << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
EOF

# Create backup script
echo -e "${YELLOW}Creating backup script...${NC}"
cat > /opt/entoo2/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/entoo2/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
docker exec entoo2-postgres pg_dump -U entoo2 entoo2 > $BACKUP_DIR/db_$DATE.sql
gzip $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_$DATE.sql.gz"
EOF

chmod +x /opt/entoo2/backup.sh

# Setup daily backup cron
echo -e "${YELLOW}Setting up daily backup cron job...${NC}"
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/entoo2/backup.sh >> /var/log/entoo2-backup.log 2>&1") | crontab -

# Display system information
echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}Server setup completed!${NC}"
echo -e "${GREEN}=================================================${NC}"
echo ""
echo -e "${YELLOW}System Information:${NC}"
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker compose version)"
echo "Deployment directory: /opt/entoo2"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Copy docker-compose.prod.yml to /opt/entoo2/"
echo "2. Copy config directory to /opt/entoo2/"
echo "3. Create .env.production in /opt/entoo2/"
echo "4. Run: cd /opt/entoo2 && docker compose -f docker-compose.prod.yml --env-file .env.production up -d"
echo ""
echo -e "${YELLOW}Security Recommendations:${NC}"
echo "1. Configure SSH key authentication"
echo "2. Disable password authentication for SSH"
echo "3. Install fail2ban: apt install fail2ban"
echo "4. Setup monitoring (htop, netdata, etc.)"
echo ""
echo -e "${GREEN}Setup complete!${NC}"
