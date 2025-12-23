#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/opt/entoo2"
COMPOSE_FILE="docker-compose.prod.yml"

echo -e "${GREEN}Starting Entoo2 deployment...${NC}"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Create deployment directory if it doesn't exist
echo -e "${YELLOW}Creating deployment directory...${NC}"
mkdir -p ${DEPLOY_DIR}
cd ${DEPLOY_DIR}

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Error: .env.production not found${NC}"
    echo -e "${YELLOW}Please create .env.production with required environment variables${NC}"
    exit 1
fi

# Pull latest images
echo -e "${YELLOW}Pulling latest Docker images...${NC}"
docker compose -f ${COMPOSE_FILE} --env-file .env.production pull

# Stop and remove old containers
echo -e "${YELLOW}Stopping old containers...${NC}"
docker compose -f ${COMPOSE_FILE} --env-file .env.production down

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker compose -f ${COMPOSE_FILE} --env-file .env.production up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Check service status
echo -e "${YELLOW}Checking service status...${NC}"
docker compose -f ${COMPOSE_FILE} --env-file .env.production ps

# Cleanup old images
echo -e "${YELLOW}Cleaning up old images...${NC}"
docker image prune -f

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Application is running at: https://$(grep DOMAIN .env.production | cut -d '=' -f2)${NC}"
